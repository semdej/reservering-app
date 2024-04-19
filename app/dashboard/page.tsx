// @ts-nocheck
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { ReserveForm } from "../components/pages/dashboard/ReserveForm";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default async function Dashboard() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
    return;
  }

  const hasTeam = profileData && profileData.team;
  const isAdmin = profileData && profileData.isadmin === true;

  return (
    <>
      <Navbar isAdmin={isAdmin} />
      {hasTeam ? (
        <>
          <Card className="mx-8 max-w-96 mt-5">
            <CardContent>
              <h1 className="text-2xl font-bold text-center mt-4">
                Welkom terug,{" "}
              </h1>
              <h1 className="text-blue-500 text-2xl font-bold text-center mt-1">
                {profileData.full_name}
              </h1>
              <Separator className="my-4" />
              <h1 className="text-xl text-center mt-2">
                Je bent lid van team{" "}
                <span className=" text-blue-500">{profileData.team}</span>
              </h1>
            </CardContent>
          </Card>
          <ReserveForm session={session} />
        </>
      ) : (
        <div className="h-screen flex flex-col justify-center items-center">
          <img
            src="/team.svg"
            alt="Team Illustration"
            className="mx-auto h-80 mb-4"
          />
          <p className="text-center text-gray-700 dark:text-white">
            Geen team gevonden, maak er een aan of neem deel aan een team op de{" "}
            <Link className="text-blue-500 hover:underline" href="/team">
              Team
            </Link>{" "}
            pagina.
          </p>
          <Button className="mt-4">
            <Link href="/team">Mijn Team</Link>
          </Button>
        </div>
      )}
    </>
  );
}
