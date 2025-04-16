export default function Footer() {
  return (
    <footer className="text-center p-6 border-t text-muted-foreground">
      &copy; {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
}
