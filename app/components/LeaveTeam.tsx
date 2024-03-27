// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Database } from "../database.types";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

const FormSchema = z.object({
  userid: z.string().optional(),
});

export function LeaveTeam({ session }: { session: Session | null }) {
  const supabaseClient = createClientComponentClient<Database>();
  const user = session?.user;

  const [userid, setUserID] = useState<string | null>(null);
  const [hasTeam, setHasTeam] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (error) {
          toast.error("Error fetching profile");
          return;
        }

        if (profile) {
          setUserID(profile.id || "");
        }
      }
    }

    fetchProfile();
  }, [user, supabaseClient]);

  useEffect(() => {
    async function checkIfUserHasTeam() {
      if (user && userid) {
        const { data: team, error } = await supabaseClient
          .from("teams")
          .select()
          .eq("userid", user.id)
          .single();

        if (error) {
          return;
        }

        if (team) {
          setHasTeam(true);
        }
      }
    }

    checkIfUserHasTeam();
  }, [user, userid, supabaseClient]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      data.userid = userid;

      const { data: teamnames, error: teamnameError } = await supabaseClient
        .from("teams")
        .select("teamname")
        .eq("teamname", user.team);

      if (teamnameError) {
        throw teamnameError;
      }

      const teamname = teamnames[0]?.teamname;

      const { data: profileUpdate, error: profileError } = await supabaseClient
        .from("profiles")
        .update({ team: "", isadmin: false })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      window.location.reload();

      toast.success("Verlaten!");
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("Fout tijdens het verlaten van het team!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasTeam) {
    return (
      <>
        <AlertDialog>
          <AlertDialogTrigger
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            variant="destructive"
            disabled={submitting || hasTeam}
          >
            Team Verlaten/Verwijderen
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
              <AlertDialogDescription>
                Deze actie kan niet ongedaan worden gemaakt. Weet je zeker dat
                je je team wilt verlaten en/of verwijderen?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleren</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={() =>
                  onSubmit(
                    form.getValues(),
                    userid,
                    user,
                    supabaseClient,
                    toast
                  )
                }
              >
                Doorgaan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
}
