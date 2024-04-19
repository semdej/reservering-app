// @ts-nocheck
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { RoomForm } from "../components/pages/rooms/RoomForm";
import { DataTable } from "./DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default async function Rooms() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const roomColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "team", header: "Team Naam" },
    { accessorKey: "roomname", header: "Kamer" },
  ];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: teamname } = await supabase
    .from("profiles")
    .select("team")
    .eq("id", session.user.id)
    .single();

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("team", teamname.team);

  const { data: teamData, error: teamDataError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const hasTeam = teamData && teamData.team;
  const isAdmin = teamData && teamData.isadmin === true;

  if (!session) {
    redirect("/");
  } else {
    return (
      <>
        <Navbar isAdmin={isAdmin} />
        {hasTeam && isAdmin ? (
          <>
            <Card className="max-w-[900px] m-8">
              <CardHeader>
                <CardTitle>Kamers</CardTitle>
                <CardDescription>
                  Hieronder vind je een overzicht van alle kamers.
                  <RoomForm session={session} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={roomColumns} data={room} />
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="h-screen flex flex-col justify-center items-center">
            <img
              src="/team.svg"
              alt="Team Illustration"
              className="mx-auto h-80 mb-4"
            />
            <p className="text-center text-gray-700 dark:text-white">
              Geen admin rol gevonden, neem contact op als u denkt dat dit een
              fout is.
            </p>
          </div>
        )}
      </>
    );
  }
}
