"use client";
import Link from "next/link";
import { Button } from "./ui/button";

import { Separator } from "./ui/separator";

import { CiLogin } from "react-icons/ci";

export default function NavbarHome() {
  return (
    <>
      <div className="flex gap-x-6 m-2 justify-between">
        <div>
          <Link href="/" legacyBehavior passHref>
            <Button className="m-2" variant="ghost">
              Home
            </Button>
          </Link>
          <Link href="/pricing" legacyBehavior passHref>
            <Button className="m-2" variant="ghost">
              Pricing
            </Button>
          </Link>
        </div>
        <div className="flex gap-x-6 m-2">
          <Button size="icon" variant="ghost">
            <Link href="/login" legacyBehavior passHref>
              <CiLogin size={25} />
            </Link>
          </Button>
        </div>
      </div>
      <Separator className="mb-5 mt-0 " />
    </>
  );
}
