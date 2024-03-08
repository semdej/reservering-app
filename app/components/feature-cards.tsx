import HeadingText from "../components/heading-text";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { FaColumns } from "react-icons/fa";
import { FaPeopleArrows } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

export default function FeatureCards() {
  return (
    <section className="bg-neutral-900">
      <div className="container space-y-8 py-12 text-center lg:py-20">
        <HeadingText subtext="Reserveer eenvoudig met ReserveMate">
          Efficiënt Ruimtebeheer
        </HeadingText>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            key="test"
            className="flex flex-grow flex-col items-center justify-between gap-4 p-8 dark:bg-neutral-800"
          >
            <div className="flex">
              <FaPeopleArrows color="#2A80FF" size={30} />
            </div>
            <div className="space-y-2">
              <CardTitle>Teams</CardTitle>
              <CardDescription>
                Beheer al uw reserveringen eenvoudig en werk samen met teams.
              </CardDescription>
            </div>
          </Card>
          <Card
            key="test"
            className="flex flex-grow flex-col items-center justify-between gap-4 p-8 dark:bg-neutral-800"
          >
            <div className="flex">
              <FaCalendarAlt color="#2A80FF" size={30} />
            </div>
            <div className="space-y-2">
              <CardTitle>Reserveren</CardTitle>
              <CardDescription>
                Laat uw klanten ruimtes reserveren met slechts een paar klikken.
              </CardDescription>
            </div>
          </Card>
          <Card
            key="test"
            className="flex flex-grow flex-col items-center justify-between gap-4 p-8 dark:bg-neutral-800"
          >
            <div className="flex">
              <FaColumns color="#2A80FF" size={30} />
            </div>
            <div className="space-y-2">
              <CardTitle>Overzicht</CardTitle>
              <CardDescription>
                Een simpel overzicht, zodat u altijd weet welke ruimtes
                beschikbaar zijn.
              </CardDescription>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
