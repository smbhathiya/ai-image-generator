import { Github, Linkedin, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-15 pt-15 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col items-center gap-3">
        <div className="flex gap-4">
          <Link
            href="https://github.com/smbhathiya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 hover:text-primary transition-colors" />
          </Link>
          <Link
            href="https://linkedin.com/in/bhathiya-lakshan-91579722a"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 hover:text-primary transition-colors" />
          </Link>
          <Link
            href="https://bhathiya.dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Portfolio"
          >
            <Globe className="w-5 h-5 hover:text-primary transition-colors" />
          </Link>
        </div>
        <div>
          &copy; {new Date().getFullYear()} AI Image Generator. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
