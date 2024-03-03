"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
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

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TimePicker } from "./time-picker";

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string().optional(),
  timeuntil: z.string().optional(), // Added "timeuntil" field to the schema
  room: z.string().optional(),
  description: z.string().optional(),
  fullname: z.string().optional(),
  team: z.string().optional(),
});

export function ReserveForm({ session }: { session: Session | null }) {
  const supabaseClient = createClientComponentClient<Database>();
  const user = session?.user;

  const [fullname, setFullname] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("full_name, team")
          .eq("id", user.id)
          .single();

        if (profileError) {
          toast.error("Error fetching profile");
          return;
        }

        if (profile) {
          setFullname(profile.full_name || "");
          setTeam(profile.team || "");
        }
      }
    }

    fetchData();
  }, [user, supabaseClient]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      data.fullname = fullname;
      data.team = team; // Include user's team in the data

      // Adjust the data object to include the time
      data.time = format(new Date(data.time), "HH:mm");
      data.timeuntil = format(new Date(data.timeuntil), "HH:mm"); // Adjust format as per your requirement

      const { data: reservation, error } = await supabaseClient
        .from("reservations")
        .insert(data);
      if (error) {
        throw error;
      }
      toast.success("Reservering toegevoegd!");
    } catch (error) {
      toast.error("Fout tijdens het reserveren!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-[600px] m-8">
      <CardHeader>
        <CardTitle>Reserveer een ruimte</CardTitle>
        <CardDescription>
          Reserveer een ruimte voor een bepaalde datum en tijd.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Datum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecteer een datum</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    De datum waarop je de ruimte wilt reserveren.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Starttijd</FormLabel>
                  <TimePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeuntil" // Added "timeuntil" field
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Eindtijd</FormLabel>
                  <TimePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ruimte</FormLabel>
                  <Input {...field} placeholder="Ruimte" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Overige Informatie</FormLabel>
                  <Input {...field} placeholder="Overige Informatie" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Volledige Naam</FormLabel>
                  <Input
                    disabled
                    {...field}
                    value={fullname || ""}
                    placeholder="Loading..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? "Laden..." : "Reserveren"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
