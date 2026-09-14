"use client";

/* eslint-disable @next/next/no-img-element -- images are direct, source-linked research references. */

import { useState } from "react";
import { ImageIcon } from "@/components/icons";
import type { CollegePhoto as CollegePhotoData } from "@/types/college";

type CollegePhotoProps = {
  photo?: CollegePhotoData;
};

export function CollegePhoto({ photo }: CollegePhotoProps) {
  const [hasLoadError, setHasLoadError] = useState(false);

  if (!photo || hasLoadError) {
    return (
      <div className="grid h-48 place-items-center bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 px-6 text-center">
        <div>
          <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
            <ImageIcon className="size-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-800">
            {photo ? "Photo available at source" : "Photo slot reserved"}
          </p>
          {photo ? (
            <a
              href={photo.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Open source photo · {photo.year} ↗
            </a>
          ) : (
            <p className="mt-1 text-xs leading-5 text-slate-500">Awaiting a verified recent college photo.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-48 bg-slate-100">
      {/* External research photos are displayed directly and fall back safely when a host blocks embedding. */}
      <img
        src={photo.url}
        alt={photo.alt}
        className="size-full object-cover"
        loading="lazy"
        onError={() => setHasLoadError(true)}
      />
      <a
        href={photo.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur hover:bg-slate-950"
      >
        Photo source · {photo.year}
      </a>
    </div>
  );
}
