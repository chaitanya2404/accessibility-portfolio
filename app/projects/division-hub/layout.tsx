import Link from "next/link";
import { Building2 } from "lucide-react";
import { MegaMenu } from "./_components/MegaMenu";
import { StaffSearch } from "./_components/StaffSearch";

export default function DivisionHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-raised">
      <div className="sticky top-0 z-10 border-b border-divider bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/projects/division-hub"
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg"
            aria-label="Division Hub home"
          >
            <Building2 className="h-5 w-5 text-accent" aria-hidden="true" />
            Division Hub
          </Link>
          <div className="flex items-center gap-3">
            <StaffSearch />
            <nav aria-label="Departments">
              <MegaMenu />
            </nav>
            <Link
              href="/projects/division-hub/service-request"
              className="hidden rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-fg hover:bg-accent-strong sm:inline"
            >
              Submit request
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
