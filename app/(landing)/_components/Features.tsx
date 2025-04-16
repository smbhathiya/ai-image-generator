import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { title: "Fast", description: "Experience lightning-fast performance." },
  { title: "Reliable", description: "Always up and ready when you need it." },
  { title: "Secure", description: "Your data is safe with us." },
];

export default function Features() {
  return (
    <section className="py-20 bg-muted px-4">
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
