import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="text-center py-24 px-4 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-4 text-primary">
        Build Better with MyApp
      </h2>
      <p className="text-muted-foreground text-lg mb-6">
        Streamline your workflow with our powerful and user-friendly tools.
      </p>
      <Button size="lg">Get Started</Button>
    </section>
  );
}
