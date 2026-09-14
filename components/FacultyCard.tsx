"use client";

import Link from "next/link";
import { BuildingIcon, MapPinIcon } from "@/components/icons";
import { getCampusPlace } from "@/data/campusPlaces";
import { useCampusExplorer } from "@/hooks/useCampusExplorer";
import type { Faculty } from "@/types/faculty";
import { formatStraightLineDistance } from "@/utils/distance";
import { getNavigationUrl } from "@/utils/navigation";

type FacultyCardProps = {
  distance?: number;
  faculty: Faculty;
};

export function FacultyCard({ distance, faculty }: FacultyCardProps) {
  const { selectPlace } = useCampusExplorer();
  const destination =
    faculty.latitude !== null && faculty.longitude !== null
      ? { latitude: faculty.latitude, longitude: faculty.longitude }
      : undefined;

  function showOnMap() {
    const place = getCampusPlace("faculty", faculty.id);
    if (place) selectPlace(place);
    document.getElementById("map-heading")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <BuildingIcon className="size-5" />
        </span>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-100">
          {faculty.shortName}
        </span>
      </div>

      <button
        type="button"
        onClick={showOnMap}
        className="mt-4 text-left text-lg font-semibold tracking-tight text-slate-950 transition hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      >
        {faculty.name}
      </button>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{faculty.description}</p>

      {distance !== undefined && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
          <MapPinIcon className="size-4" /> {formatStraightLineDistance(distance)}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Link
          href={`/faculties/${faculty.slug}`}
          className="rounded-xl bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View details
        </Link>
        {destination && (
          <a
            href={getNavigationUrl(destination)}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-100"
          >
            Navigate ↗
          </a>
        )}
      </div>
    </article>
  );
}
