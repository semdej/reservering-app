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

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  room: z.string().optional(),
  description: z.string().optional(),
  fullname: z.string().optional(),
});

export function ReserveForm({ session }: { session: Session | null }) {
  const supabaseClient = createClientComponentClient<Database>();
  const user = session?.user;

  const [fullname, setFullname] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (error) {
          toast.error("Error fetching profile");
          return;
        }

        if (profile) {
          setFullname(profile.full_name || "");
        }
      }
    }

    fetchProfile();
  }, [user, supabaseClient]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      // Add the username to the reservation data before inserting
      data.fullname = fullname;
      const { data: reservation, error } = await supabaseClient
        .from("reservations")
        .insert(data);
      if (error) {
        throw error;
      }
      toast.success("Reservation added!");
    } catch (error) {
      toast.error("Error adding reservation!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
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
                        <span>Select a date</span>
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
              <FormDescription>The date you want to reserve.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Room</FormLabel>
              <Input {...field} placeholder="Room" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Additional Info</FormLabel>
              <Input {...field} placeholder="Additional information" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fullname</FormLabel>
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
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
