import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10 mt-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-foreground">
              Kaden MacLean
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Soquel, CA · ChargerTools LLC
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-foreground transition-colors link-underline">
              Work
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors link-underline">
              About
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors link-underline">
              Writing
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors link-underline">
              Contact
            </Link>
            <a
              href="https://github.com/chargertools"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors link-underline"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-8">
          &copy; {year} ChargerTools LLC
        </p>
      </div>
    </footer>
  );
}
