"use client";
import { buttonVariants } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

function RowActions() {
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
        <DropdownMenuItem>Wijzigen</DropdownMenuItem>
        <DropdownMenuItem>Verwijderen</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RowActions;
