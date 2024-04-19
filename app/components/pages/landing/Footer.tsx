import Link from "next/link";
import { Separator } from "../../ui/separator";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <Separator className="my-5" />

      <div className="flex flex-col md:flex-row justify-between items-center m-2 my-5">
        <div className="flex items-center w-full overflow-x-auto mb-4 md:mb-0">
          <Link href="/" legacyBehavior passHref>
            <Image src="/logo.svg" alt="ReserveMate" width={150} height={50} />
          </Link>
        </div>
      </div>
    </>
  );
}
