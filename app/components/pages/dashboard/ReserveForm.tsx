// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Database } from "../../../database.types";
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
} from "../../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { TimePicker } from "../../time-picker";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { DataTable } from "../../DataTable";
import { Calendar } from "../../ui/calendar";
import { IoIosWarning } from "react-icons/io";

const FormSchema = z.object({
  date: z.date({
    required_error: "Een datum is verplicht.",
  }),
  time: z.string({ required_error: "Een starttijd is verplicht." }),
  timeuntil: z.string({ required_error: "Een eindtijd is verplicht." }),
  room: z.string({ required_error: "Een kamer is verplicht." }),
  description: z.string().optional(),
  fullname: z.string().optional(),
  team: z.string().optional(),
});

export function ReserveForm({ session }: { session: Session | null }) {
  const supabaseClient = createClientComponentClient<Database>();
  const user = session?.user;

  const [fullname, setFullname] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [rooms, setRooms] = useState<{ roomname: string }[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const hasRooms = rooms.length > 0;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        const { data: profile2, error: profile2Error } = await supabaseClient
          .from("profiles")
          .select("team")
          .eq("id", user.id)
          .single();

        if (profileError || profile2Error) {
          toast.error("Error fetching profile");
          return;
        }

        if (profile) {
          setFullname(profile.full_name || "");
        }

        if (profile2) {
          setTeam(profile2.team || "");
        }

        const { data: rooms, error: roomsError } = await supabaseClient
          .from("rooms")
          .select("roomname")
          .eq("team", profile2.team);

        if (roomsError) {
          toast.error("Error fetching rooms");
          return;
        }

        if (rooms) {
          setRooms(rooms);
        }

        if (selectedDate) {
          const formattedDate = format(selectedDate, "yyyy-MM-dd");
          const { data: reservations, error: reservationsError } =
            await supabaseClient
              .from("reservations")
              .select("*")
              .eq("date", formattedDate)
              .eq("team", profile2.team);

          if (reservationsError) {
            toast.error("Error fetching reservations");
            console.log = reservationsError;
            return;
          }

          if (reservations) {
            setReservations(reservations);
          }
        }
      }
    }

    fetchData();
  }, [user, supabaseClient, selectedDate]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      data.fullname = fullname;
      data.team = team;
      data.date = format(selectedDate, "yyyy-MM-dd");
      data.time = format(new Date(data.time), "HH:mm");
      data.timeuntil = format(new Date(data.timeuntil), "HH:mm");

      const { data: reservation, error } = await supabaseClient
        .from("reservations")
        .insert(data);
      if (error) {
        throw error;
      }
      window.location.reload();

      toast.success("Reservering toegevoegd!");
    } catch (error) {
      toast.error("Fout tijdens het reserveren!");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Starttijd",
      accessorKey: "time",
    },
    {
      header: "Eindtijd",
      accessorKey: "timeuntil",
    },
    {
      header: "Ruimte",
      accessorKey: "room",
    },
  ];

  return (
    <Card className="max-w-[600px] m-8">
      <CardHeader>
        <CardTitle>Reserveer een ruimte</CardTitle>

        <CardDescription>
          Reserveer een ruimte voor een bepaalde datum en tijd.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
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
                        <Button variant="outline">
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
                        onSelect={(date) => {
                          field.onChange(date);
                          setSelectedDate(date);
                        }}
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

            {selectedDate && (
              <DataTable columns={columns} data={reservations} />
            )}

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
              name="timeuntil"
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

            {hasRooms ? (
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ruimte</FormLabel>
                    <RadioGroup
                      defaultValue={field.value}
                      onChange={field.onChange}
                    >
                      {rooms.map((room, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={room.roomname}
                            id={room.roomname}
                          />
                          <Label htmlFor={room.roomname}>{room.roomname}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormLabel className="flex flex-col">Ruimte</FormLabel>
                <p className="text-red-500">
                  <IoIosWarning size={40} className="text-red-500" />
                  Geen kamers gevonden, vraag de beheerder van uw team om kamers
                  aan te maken!
                </p>
              </>
            )}
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
            <div className="hidden">
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
            </div>
            {hasRooms ? (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Laden..." : "Reserveren"}
              </Button>
            ) : (
              <Button type="submit" disabled>
                Reserveren
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
