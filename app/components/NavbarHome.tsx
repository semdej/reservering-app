"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { CiLogin } from "react-icons/ci";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./ModeToggle";

export default function NavbarHome() {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between m-2 lg:mr-8	lg:ml-8">
        <div className="flex items-center gap-x-6">
          <Image src="/logo.svg" alt="ReserveMate" width={150} height={50} />
          <div className="flex flex-wrap gap-x-2">
            <Link href="/" legacyBehavior passHref>
              <Button className="m-2" variant="ghost">
                Home
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:mt-0 mt-4 flex items-center">
          <Link href="/login" legacyBehavior passHref>
            <Button className="m-2" size="default" variant="default">
              <CiLogin className="mr-2" size={25} />
              Inloggen
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
      <Separator />
    </>
  );
}
