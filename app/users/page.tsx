// @ts-nocheck
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
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

  const userColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "username", header: "Gebruikersnaam" },
    { accessorKey: "team", header: "Team" },
  ];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: teamname } = await supabase
    .from("profiles")
    .select("team")
    .eq("id", session.user.id)
    .single();

  const { data: users } = await supabase
    .from("profiles")
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
                <CardTitle>Gebruikers</CardTitle>
                <CardDescription>
                  Hieronder vind je een overzicht van alle gebruikers in jouw
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={userColumns} data={users} />
              </CardContent>
            </Card>
            <Card className="max-w-[600px] m-8">
              <CardHeader>
                <CardTitle className="text-center">Totale Gebruikers</CardTitle>
                <CardDescription className="text-center">
                  Hieronder vind je het totaal aantal gebruikers in jouw team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-center text-blue-600">
                  {users.length}
                </p>
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
