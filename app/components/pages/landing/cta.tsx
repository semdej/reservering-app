import Image from "next/image";
import { CardDescription, CardTitle } from "../../../components/ui/card";
import { Button } from "../../ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center md:order-2">
            <Image
              src="/cta.svg"
              alt="CTA Image"
              className="w-full h-auto md:max-w-lg"
              width={500}
              height={500}
            />
          </div>
          <div className="flex flex-col justify-center md:order-1">
            <div className="max-w-lg mx-auto">
              <div className="space-y-2">
                <CardTitle className="text-4xl text-center md:text-left">
                  Nooit meer papier administratiewerk
                </CardTitle>
                <CardDescription className="text-lg text-center md:text-left">
                  Beheer al uw reserveringen eenvoudig online en bespaar
                  kostbare tijd.
                </CardDescription>
                <div className="flex justify-center md:justify-start">
                  <Button>
                    <Link href="/login">Start nu</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
