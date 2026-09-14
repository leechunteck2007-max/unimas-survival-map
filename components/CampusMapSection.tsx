"use client";

import dynamic from "next/dynamic";

const CampusMap = dynamic(() => import("@/components/CampusMap"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-80 place-items-center rounded-3xl bg-slate-100 sm:min-h-96">
      <p className="text-sm font-medium text-slate-500">Loading campus map…</p>
    </div>
  ),
});

type CampusMapSectionProps = {
  facultyOnly?: boolean;
  initialFacultyId?: string;
};

export function CampusMapSection(props: CampusMapSectionProps) {
  return <CampusMap {...props} />;
}
