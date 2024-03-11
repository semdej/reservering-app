// @ts-nocheck
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { RoomForm } from "../components/RoomForm";
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

  if (!session) {
    redirect("/");
  } else {
    return (
      <>
        <Navbar />
        <RoomForm session={session} />
        <Card className="max-w-[900px] m-8">
          <CardHeader>
            <CardTitle>Kamers</CardTitle>
            <CardDescription>
              Hieronder vind je een overzicht van alle kamers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={roomColumns} data={room} />
          </CardContent>
        </Card>
      </>
    );
  }
}
