import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { ReserveForm } from "../components/ReserveForm";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default async function Dashboard() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true });

  if (!session) {
    redirect("/");
  } else {
    return (
      <>
        <Navbar />
        <ReserveForm />
      </>
    );
  }
}
