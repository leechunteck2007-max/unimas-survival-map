import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CampusMapSection } from "@/components/CampusMapSection";
import { FacultyActions } from "@/components/FacultyActions";
import { faculties, getFacultyBySlug, hasValidCoordinates } from "@/data/faculties";

type FacultyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return faculties.map((faculty) => ({ slug: faculty.slug }));
}

export async function generateMetadata({ params }: FacultyPageProps): Promise<Metadata> {
  const faculty = getFacultyBySlug((await params).slug);
  return faculty
    ? { title: `${faculty.shortName} · UNIMAS Survival`, description: faculty.description }
    : {};
}

export default async function FacultyPage({ params }: FacultyPageProps) {
  const faculty = getFacultyBySlug((await params).slug);
  if (!faculty) notFound();

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <AppHeader />
        <Link
          href="/#faculties-heading"
          className="mt-8 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          ← Back to all faculties
        </Link>

        <header className="mt-6 rounded-3xl bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-10">
          <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-200 ring-1 ring-inset ring-blue-400/30">
            {faculty.shortName} · Verified faculty
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
            {faculty.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            {faculty.description}
          </p>
          <div className="mt-6">
            <FacultyActions faculty={faculty} />
          </div>
        </header>

        {hasValidCoordinates(faculty) && (
          <section className="mt-8" aria-labelledby="faculty-map-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Location</p>
                <h2 id="faculty-map-heading" className="mt-1 text-xl font-semibold">
                  Find {faculty.shortName} on campus
                </h2>
              </div>
              {faculty.coordinateSourceUrl && (
                <a
                  href={faculty.coordinateSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                >
                  Map source ↗
                </a>
              )}
            </div>
            <CampusMapSection facultyOnly initialFacultyId={faculty.id} />
          </section>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Faculty information">
          {faculty.address && (
            <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">Address</h2>
              <p className="mt-2 text-sm leading-6 text-slate-800">{faculty.address}</p>
            </article>
          )}
          {faculty.openingHours && (
            <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">Opening hours</h2>
              <p className="mt-2 text-sm leading-6 text-slate-800">{faculty.openingHours}</p>
            </article>
          )}
          {(faculty.phone || faculty.email) && (
            <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">Contact</h2>
              {faculty.phone && <p className="mt-2 text-sm text-slate-800">{faculty.phone}</p>}
              {faculty.email && (
                <a className="mt-1 block text-sm text-blue-700" href={`mailto:${faculty.email}`}>
                  {faculty.email}
                </a>
              )}
            </article>
          )}
          {faculty.facilities.length > 0 && (
            <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">Facilities</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-800">
                {faculty.facilities.map((facility) => <li key={facility}>• {facility}</li>)}
              </ul>
            </article>
          )}
        </section>

        <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
          {faculty.website && (
            <a href={faculty.website} target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-900">
              Official faculty website ↗
            </a>
          )}
          <a href={faculty.sourceUrl} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900">
            Information source ↗
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-500">Data checked {faculty.lastUpdated}.</p>
      </div>
    </main>
  );
}
