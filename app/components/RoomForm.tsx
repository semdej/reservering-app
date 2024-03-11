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
  roomname: z.string({ required_error: "Een kamer naam is verplicht." }),
  team: z.string().optional(),
});

export function RoomForm({ session }: { session: Session | null }) {
  const supabaseClient = createClientComponentClient<Database>();
  const user = session?.user;

  const [team, setTeam] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("team")
          .eq("id", user.id)
          .single();

        if (error) {
          toast.error("Error fetching profile");
          return;
        }

        if (profile) {
          setTeam(profile.team || "");
        }
      }
    }

    fetchProfile();
  }, [user, supabaseClient]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const data = form.getValues();
      data.team = team;
      const { data: room, error } = await supabaseClient
        .from("rooms")
        .insert(data);
      if (error) {
        throw error;
      }
      window.location.reload();

      toast.success("Kamer aangemaakt!");
    } catch (error) {
      toast.error("Fout tijdens het aanmaken van de kamer!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-[600px] m-8">
      <CardHeader>
        <CardTitle>Maak kamers aan</CardTitle>
        <CardDescription>
          Maak kamers aan die klanten kunnen boeken.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="roomname"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Kamer Naam</FormLabel>
                  <Input {...field} placeholder="Kamer Naam" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Team Naam</FormLabel>
                  <Input
                    disabled
                    {...field}
                    value={team || ""}
                    placeholder="Loading..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={submitting}>
              {submitting ? "Laden..." : "Aanmaken"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
