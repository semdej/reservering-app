"use client";
import { buttonVariants } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../database.types";

function RowActions() {
  const supabaseClient = createClientComponentClient<Database>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({
          variant: "outline",
          class: "font-bold",
        })}
      >
        ...
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Acties</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            console.log("Wijzigen");
          }}
        >
          Wijzigen
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("Verwijderen");
          }}
        >
          Verwijderen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RowActions;
