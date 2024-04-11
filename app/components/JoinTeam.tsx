// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Database } from "../database.types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const FormSchema = z.object({
  invitecode: z.string({ required_error: "Een invite code is verplicht." }),
  userid: z.string().optional(),
});

export function JoinTeam({ session }: { session: Session | null }) {
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
        .eq("invitecode", data.invitecode);

      if (teamnameError) {
        throw teamnameError;
      }

      const teamname = teamnames[0]?.teamname;

      const { data: profileUpdate, error: profileError } = await supabaseClient
        .from("profiles")
        .update({ team: teamname })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      window.location.reload();

      toast.success("Deelgenomen!");
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Fout tijdens het deelnemen aan het team!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasTeam) {
    return (
      <Card className="max-w-[600px] m-8">
        <CardHeader>
          <CardTitle>Neem deel aan een team</CardTitle>
          <CardDescription>
            Neem deel aan een team om kamers te reserveren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="invitecode"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Invite Code</FormLabel>
                    <Input {...field} placeholder="Code..." />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="userid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>User ID</FormLabel>
                      <Input
                        disabled
                        {...field}
                        value={userid}
                        placeholder="Loading..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={submitting || hasTeam}>
                {submitting ? "Laden..." : "Deelnemen"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
}
