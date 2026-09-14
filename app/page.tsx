import { AppHeader } from "@/components/AppHeader";
import { CampusMapSection } from "@/components/CampusMapSection";
import { CategoryAvailability } from "@/components/CategoryAvailability";
import { CategoryList } from "@/components/CategoryList";
import { CollegeDirectory } from "@/components/CollegeDirectory";
import { FacultyDirectory } from "@/components/FacultyDirectory";
import { NearbyPlaces } from "@/components/NearbyPlaces";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-stone-50 text-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <AppHeader />

        <section className="mt-9 max-w-2xl sm:mt-14">
          <p className="text-sm font-semibold tracking-wide text-emerald-700">
            YOUR CAMPUS, MADE SIMPLE
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            Find what you need around UNIMAS.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Quickly discover food, study spots, facilities, and other useful
            places across campus.
          </p>
        </section>

        <div className="mt-7 sm:mt-9">
          <SearchBar />
        </div>

        <section className="mt-8" aria-labelledby="categories-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Browse by</p>
              <h2 id="categories-heading" className="mt-1 text-xl font-semibold tracking-tight">
                Categories
              </h2>
            </div>
            <span className="text-sm font-semibold text-emerald-700">All places</span>
          </div>
          <CategoryList />
          <CategoryAvailability />
        </section>

        <section className="mt-9" aria-labelledby="map-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Explore</p>
              <h2 id="map-heading" className="mt-1 text-xl font-semibold tracking-tight">
                Campus map
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
              Live map
            </span>
          </div>
          <CampusMapSection />
        </section>

        <NearbyPlaces />

        <FacultyDirectory />
        <CollegeDirectory />
      </div>
    </main>
  );
}
