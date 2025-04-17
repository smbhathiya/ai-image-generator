import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <>
      <div className="m-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary text-2xl font-bold">
              Recent
            </CardTitle>
            <CardDescription>Comming soon</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="m-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary text-2xl font-bold">
              History
            </CardTitle>
            <CardDescription>Comming soon</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
