"use client";
import Image from "next/image";
import { Separator } from "../../ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Link from "next/link";

export default function ReserveInfo() {
  return (
    <>
      <Card className="max-w-[600px] m-8">
        <CardHeader>
          <CardTitle>Hoe reserveer ik?</CardTitle>
          <CardDescription>
            Vind hier alle informatie over het reserveren van een plek.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="step1" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="step1">Stap 1</TabsTrigger>
              <TabsTrigger value="step2">Stap 2</TabsTrigger>
              <TabsTrigger value="step3">Stap 3</TabsTrigger>
            </TabsList>
            <TabsContent value="step1">
              <Image
                src="/step1.svg"
                alt="Reserve Illustration"
                width={500}
                height={300}
              />
              Voeg je persoonlijke informatie toe aan je account{" "}
              <Link href="/account" className="text-blue-500 hover:underline">
                Account
              </Link>{" "}
              pagina.
            </TabsContent>
            <TabsContent value="step2">
              {" "}
              <Image
                src="/step2.svg"
                alt="Reserve Illustration"
                width={500}
                height={300}
              />
              Maak een reservering op de dashboard pagina.
            </TabsContent>
            <TabsContent value="step3">
              <Image
                src="/step3.svg"
                alt="Reserve Illustration"
                width={300}
                height={300}
              />
              Ben je een admin? Dan kan je alle reserveringen inzien op de
              reserveringen pagina.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
