"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";
import * as nl from "./nl.json";

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="mb-6 text-center">
            <img
              src="/login.svg"
              alt="Login Illustration"
              className="mx-auto h-24 mb-4"
            />
            <h2 className="text-gray-700 text-2xl font-semibold mb-2">
              Inloggen
            </h2>
            <p className="text-gray-600">
              Log in met je gebruikersnaam en wachtwoord of via een provider.
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            view="sign_in"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#2A80FF",
                    brandAccent: "#2A80FF",
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            redirectTo="https://reservemate.nl/auth/callback"
            localization={{
              variables: nl,
            }}
          />
        </div>
      </div>
    </div>
  );
}
