import Navbar from "../components/Navbar";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

export default function loading() {
  return (
    <>
      <Navbar isAdmin={false} />
      <Card>
        <CardContent>
          <Skeleton className="h-120 w-[600px]" />
        </CardContent>
      </Card>
    </>
  );
}
