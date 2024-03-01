import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { TeamForm } from "../components/TeamForm";
import { DataTable } from "./DataTable";

export default async function Team() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const teamColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "teamname", header: "Teamname" },
    { accessorKey: "fullname", header: "Owner" },
  ];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: fullname } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", session.user.id)
    .single();

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("fullname", fullname.full_name);

  if (!session) {
    redirect("/");
  } else {
    return (
      <>
        <Navbar />
        <TeamForm session={session} />
        <DataTable columns={teamColumns} data={team} />
      </>
    );
  }
}
