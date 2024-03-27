// @ts-nocheck
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { ReserveForm } from "../components/ReserveForm";
import Link from "next/link";
import { Button } from "../components/ui/button";
import ReserveInfo from "../components/ReserveInfo";

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
          <ReserveForm session={session} />
          <ReserveInfo />
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
