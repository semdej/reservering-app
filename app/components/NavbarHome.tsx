"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { CiLogin } from "react-icons/ci";
import Image from "next/image";
import { Separator } from "./ui/separator";

export default function NavbarHome() {
  return (
    <>
      <div className="flex items-center justify-between m-2">
        <div className="flex items-center gap-x-6">
          <Image src="/logo.svg" alt="ReserveMate" width={200} height={50} />
          <Link href="/" legacyBehavior passHref>
            <Button className="m-2" variant="ghost">
              Home
            </Button>
          </Link>
          <Link href="/pricing" legacyBehavior passHref>
            <Button className="m-2" variant="ghost">
              Prijs
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/login" legacyBehavior passHref>
            <Button className="m-2" size="icon" variant="ghost">
              <CiLogin size={25} />
            </Button>
          </Link>
        </div>
      </div>
      <Separator />
    </>
  );
}
