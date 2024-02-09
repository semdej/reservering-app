import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="flex gap-x-6 m-3 justify-between">
      <div>
        <Link href="/dashboard" legacyBehavior passHref>
          <Button variant="outline">Dashboard</Button>
        </Link>
        <Link href="/account" legacyBehavior passHref>
          <Button variant="outline">Account</Button>
        </Link>
      </div>
      <form action="/auth/signout" method="post">
        <Button variant="outline">Uitloggen</Button>
      </form>
    </div>
  );
}
