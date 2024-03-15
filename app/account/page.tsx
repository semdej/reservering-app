// @ts-nocheck

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import AccountForm from "./account-form";
import Navbar from "../components/Navbar";

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const isAdmin = profileData && profileData.isadmin === true;

  return (
    <>
      <Navbar isAdmin={isAdmin} />

      <AccountForm session={session} />
    </>
  );
}
