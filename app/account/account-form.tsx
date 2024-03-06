"use client";
import { useCallback, useEffect, useState } from "react";
import Avatar from "./avatar";
import { Database } from "../database.types";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import Navbar from "../components/Navbar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user?.id ?? "")
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      toast.error("Error met het bijwerken van je profiel!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      let { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profiel bijgewerkt!");
    } catch (error) {
      toast.error("Error met het bijwerken van je profiel!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <Card className="max-w-[900px] m-8">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Hieronder kun je je profiel bijwerken.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="form-widget">
            <Avatar
              uid={user!.id}
              url={avatar_url}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ fullname, username, website, avatar_url: url });
              }}
            />
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                value={session?.user.email}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="fullName">Volledige Naam</Label>
              <Input
                id="fullName"
                type="text"
                value={fullname || ""}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="username">Gebruikersnaam</Label>
              <Input
                id="username"
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website || ""}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="flex gap-x-6 m-3 justify-between">
              <div>
                <Button
                  className="button primary block"
                  onClick={() =>
                    updateProfile({ fullname, username, website, avatar_url })
                  }
                  disabled={loading}
                >
                  {loading ? "Laden ..." : "Bijwerken"}
                </Button>
              </div>

              <div>
                <form action="/auth/signout" method="post">
                  <Button className="button block" type="submit">
                    Uitloggen
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
