import Link from "next/link";
import { AccountMenu } from "@/components/account-menu";
import { DesktopNav, MobileNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="relative mx-auto flex w-full min-w-0 max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground"
          >
            RGS
          </span>
          <span className="hidden sm:inline">Rip, Grade or Sell</span>
          <span className="sm:hidden">RGS</span>
        </Link>
        <DesktopNav />
        <div className="ml-auto flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <AccountMenu />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
