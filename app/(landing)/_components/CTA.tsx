import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="text-center py-24 px-4">
      <h2 className="text-3xl font-bold text-primary mb-4">
        Ready to get started?
      </h2>
      <p className="text-muted-foreground mb-6">
        Join thousands of users already using MyApp.
      </p>
      <Button size="lg">Start Free Trial</Button>
    </section>
  );
}
