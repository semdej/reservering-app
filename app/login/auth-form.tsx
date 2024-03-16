"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6 text-center">
            <img
              src="/login.svg"
              alt="Login Illustration"
              className="mx-auto h-24 mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">Log in</h2>
            <p className="text-gray-600">
              Welkom terug! Log in met je e-mailadres om door te gaan.
            </p>
          </div>
          <Auth
            supabaseClient={supabase}
            view="magic_link"
            appearance={{ theme: ThemeSupa }}
            theme="light"
            showLinks={false}
            providers={[]}
            redirectTo="https://reservemate.nl/auth/callback"
          />
        </div>
      </div>
    </div>
  );
}
