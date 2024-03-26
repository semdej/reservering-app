"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";
import * as nl from "./nl.json";

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
            <h2 className="text-gray-600 text-2xl font-semibold mb-2">
              Inloggen
            </h2>
            <p className="text-gray-600">
              Log in met je e-mailadres of een van de andere opties om verder te
              gaan.
            </p>
          </div>
          <Auth
            supabaseClient={supabase}
            view="magic_link"
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
            showLinks={false}
            providers={["github", "google"]}
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
