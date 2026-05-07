import Link from "next/link";
import { Building2 } from "lucide-react";
import { MegaMenu } from "./_components/MegaMenu";

export default function DivisionHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/projects/division-hub"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            aria-label="Division Hub home"
          >
            <Building2 className="h-5 w-5 text-indigo-700" aria-hidden="true" />
            Division Hub
          </Link>
          <nav aria-label="Departments">
            <MegaMenu />
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
