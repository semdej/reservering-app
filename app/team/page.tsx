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
import { JoinTeam } from "../components/JoinTeam";
import { LeaveTeam } from "../components/LeaveTeam";
import { RemoveTeam } from "../components/RemoveTeam";

export default async function Team() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const teamColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "teamname", header: "Team Naam" },
    { accessorKey: "invitecode", header: "Invite Code" },
  ];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { id: userId, team: userTeam },
  } = await supabase
    .from("profiles")
    .select("id, team")
    .eq("id", session.user.id)
    .single();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("userid", userId);

  const isAdmin = profileData && profileData.isadmin === true;
  const hasTeam = userTeam !== "";

  if (!session) {
    redirect("/");
  } else {
    return (
      <>
        <Navbar isAdmin={isAdmin} />
        {hasTeam ? (
          <Card className="max-w-[600px] m-8">
            <CardHeader>
              <CardTitle>Uw huidige team: {userTeam}</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveTeam session={session} />
              {isAdmin ? <RemoveTeam session={session} /> : null}
            </CardContent>
          </Card>
        ) : null}
        {!hasTeam ? (
          <>
            <TeamForm session={session} />
            <JoinTeam session={session} />
          </>
        ) : null}
        {isAdmin ? (
          <Card className="max-w-[600px] m-8">
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
        ) : null}
      </>
    );
  }
}
