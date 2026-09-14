import Link from "next/link";
import { CompassIcon } from "@/components/icons";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/#top" className="flex items-center gap-3" aria-label="UNIMAS Survival home">
        <span className="grid size-11 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
          <CompassIcon className="size-6" />
        </span>
        <span>
          <span className="block text-lg font-semibold leading-none tracking-tight">
            UNIMAS Survival
          </span>
          <span className="mt-1 block text-xs font-medium text-slate-500">
            Campus essentials, one map
          </span>
        </span>
      </Link>

      <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200 sm:inline-flex">
        Phase 1 · MVP
      </span>
    </header>
  );
}
