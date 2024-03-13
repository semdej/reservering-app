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
  teamname: z.string({ required_error: "Een team naam is verplicht." }),
  userid: z.string().optional(),
});

export function TeamForm({ session }: { session: Session | null }) {
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
      const { data: team, error } = await supabaseClient
        .from("teams")
        .insert(data);

      window.location.reload();
      if (error) {
        throw error;
      }

      const { data: profileUpdate, profileError } = await supabaseClient
        .from("profiles")
        .update({ team: data.teamname })
        .eq("id", user.id);

      const { data: adminUpdate, adminError } = await supabaseClient
        .from("profiles")
        .update({ isadmin: true })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      if (adminError) {
        throw adminError;
      }

      toast.success("Team aangemaakt!");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Fout tijdens het aanmaken van het team!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasTeam) {
    return (
      <Card className="max-w-[600px] m-8">
        <CardHeader>
          <CardTitle>Maak een team aan</CardTitle>
          <CardDescription>
            Maak een team aan en nodig je collega's uit om samen te werken.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="teamname"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Team Naam</FormLabel>
                    <Input {...field} placeholder="Team Naam" />
                    <FormMessage />
                  </FormItem>
                )}
              />
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

              <Button type="submit" disabled={submitting || hasTeam}>
                {submitting ? "Laden..." : "Aanmaken"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
}
