export default function HowItWorks() {
  return (
    <section className="py-24 ">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">How It Works</h2>
        <ol className="space-y-8 text-left max-w-xl mx-auto">
          <li>
            <strong>1. Enter a Prompt:</strong>{" "}
            <span className="text-muted-foreground">
              Type in any idea, concept, or scene you want to visualize.
            </span>
          </li>
          <li>
            <strong>2. AI Generates:</strong>{" "}
            <span className="text-muted-foreground">
              Our AI turns your prompt into a stunning image.
            </span>
          </li>
          <li>
            <strong>3. Download or Share:</strong>{" "}
            <span className="text-muted-foreground">
              Save your creation or share it with the world.
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}
