import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { CiSettings } from "react-icons/ci";

export default function Navbar() {
  return (
    <div className="flex gap-x-6 m-3 justify-between">
      <div>
        <Link href="/dashboard" legacyBehavior passHref>
          <Button className="m-2" variant="outline">
            Dashboard
          </Button>
        </Link>
        <Link href="/reservations" legacyBehavior passHref>
          <Button className="m-2" variant="outline">
            Reservations
          </Button>
        </Link>
      </div>
      <div className="flex gap-x-6 m-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <CiSettings size={25} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <Link href="/account" legacyBehavior passHref>
                Mijn Account
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <Link href="/team" legacyBehavior passHref>
                Mijn Team
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form action="/auth/signout" method="post">
                <button>Uitloggen</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
