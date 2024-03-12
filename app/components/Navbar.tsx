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

import { Separator } from "./ui/separator";

import { CiSettings } from "react-icons/ci";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center m-2">
        <div className="flex items-center w-full overflow-x-auto mb-4 md:mb-0">
          <Image src="/logo.svg" alt="ReserveMate" width={200} height={50} />
          <div className="flex flex-wrap gap-x-2">
            <Link href="/dashboard" legacyBehavior passHref>
              <Button className="m-2" variant="ghost">
                Dashboard
              </Button>
            </Link>
            <Link href="/reservations" legacyBehavior passHref>
              <Button className="m-2" variant="ghost">
                Reserveringen
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
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
              <DropdownMenuLabel>
                <Link href="/rooms" legacyBehavior passHref>
                  Mijn Kamers
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
      <Separator />
    </>
  );
}
