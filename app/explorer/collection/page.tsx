import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function CollectionPage() {
  return (
    <div className="m-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-2xl font-bold">
            Image Collection
          </CardTitle>
          <CardDescription>Comming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
export default CollectionPage;
