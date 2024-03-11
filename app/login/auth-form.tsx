"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>();
  return (
    <>
      <Card className="max-w-[1000px] m-8">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Log in met je e-mailadres of een magic link.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <Auth
            supabaseClient={supabase}
            view="magic_link"
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            showLinks={false}
            providers={[]}
            redirectTo="https://reservering-app.vercel.app/auth/callback"
          />
        </CardContent>
      </Card>
    </>
  );
}
