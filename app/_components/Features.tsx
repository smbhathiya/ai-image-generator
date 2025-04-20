import { IconSparkles, IconWand, IconDownload } from "@tabler/icons-react";

const features = [
  {
    icon: <IconWand className="w-6 h-6 text-primary" />,
    title: "AI-Powered",
    desc: "Uses advanced AI to generate stunning images from your input.",
  },
  {
    icon: <IconSparkles className="w-6 h-6 text-primary" />,
    title: "Fast & Easy",
    desc: "Get images in seconds with a clean and intuitive interface.",
  },
  {
    icon: <IconDownload className="w-6 h-6 text-primary" />,
    title: "Download & Share",
    desc: "Download in high quality and share wherever you want.",
  },
];

export default function Features() {
  return (
    <section className="py-24 dark:bg-muted/40 bg-muted rounded-xl m-4">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-primary">Features</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-background p-10 rounded-xl shadow items-center text-center justify-center"
            >
              <div className="mb-4 flex justify-center">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
