// @ts-nocheck
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { DataTable } from "./DataTable";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Link from "next/link";

export default async function Reservations() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("team")
    .eq("id", session.user.id);

  const { data: teamData, error: teamDataError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profileData || profileData.length === 0) {
    console.error("Error fetching user data:", profileError);
    return null;
  }

  const userTeam = profileData[0].team;

  const { data: reservations, error: reservationsError } = await supabase
    .from("reservations")
    .select("*")
    .eq("team", userTeam)
    .order("date", { ascending: true });

  if (reservationsError) {
    toast.error("Error fetching reservations!");
    return null;
  }

  reservations.forEach((reservation) => {
    reservation.created_at = new Date(reservation.created_at).toLocaleString();
  });

  const reservationColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "created_at", header: "Aangemaakt Op" },
    { accessorKey: "date", header: "Datum" },
    { accessorKey: "room", header: "Ruimte" },
    { accessorKey: "description", header: "Beschrijving" },
    { accessorKey: "fullname", header: "Volledige Naam" },
    { accessorKey: "team", header: "Team" },
    { accessorKey: "time", header: "Starttijd" },
    { accessorKey: "timeuntil", header: "Eindtijd" },
  ];

  const hasTeam = teamData && teamData.team;
  const isAdmin = teamData && teamData.isadmin === true;

  return (
    <div>
      <Navbar isAdmin={isAdmin} />
      {hasTeam && isAdmin ? (
        <Card className="max-w-[1000px] m-8">
          <CardHeader>
            <CardTitle>Reserveringen</CardTitle>
            <CardDescription>
              Hieronder vind je een overzicht van alle reserveringen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={reservationColumns} data={reservations} />
          </CardContent>
        </Card>
      ) : (
        <div className="h-screen flex flex-col justify-center items-center">
          <img
            src="/team.svg"
            alt="Team Illustration"
            className="mx-auto h-80 mb-4"
          />
          <p className="text-center text-gray-700">
            Geen admin rol gevonden, neem contact op als u denkt dat dit een
            fout is.
          </p>
        </div>
      )}
    </div>
  );
}
