// @ts-nocheck
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { TeamForm } from "../components/TeamForm";
import { DataTable } from "./DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default async function Team() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const teamColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "teamname", header: "Team Naam" },
    { accessorKey: "userid", header: "UserID" },
  ];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: userid } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", session.user.id)
    .single();

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("userid", userid.id);

  if (!session) {
    redirect("/");
  } else {
    return (
      <>
        <Navbar />
        <TeamForm session={session} />
        <Card className="max-w-[900px] m-8">
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>
              Hieronder vind je een overzicht van jouw team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={teamColumns} data={team} />
          </CardContent>
        </Card>
      </>
    );
  }
}
