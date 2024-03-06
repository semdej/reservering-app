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

export default async function Reservations() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data: reservations, error: reservationsError } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true });

  if (reservationsError) {
    toast.error("Error fetching reservations!");
    return null;
  }

  const reservationColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "created_at", header: "Created At" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "room", header: "Room" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "fullname", header: "Fullname" },
    { accessorKey: "team", header: "Team" },
    { accessorKey: "time", header: "Starttijd" },
    { accessorKey: "timeuntil", header: "Eindtijd" },
  ];

  return (
    <div>
      <Navbar />
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
    </div>
  );
}
