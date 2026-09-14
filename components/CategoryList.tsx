"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AppIcon, type IconName } from "@/components/icons";
import { campusCategories } from "@/data/campusCategories";
import { campusPlacesInCategory } from "@/data/campusPlaces";
import { useCampusExplorer, type CampusCategory } from "@/hooks/useCampusExplorer";
import {
  getCategoryClickIntent,
  getCategoryOverviewTargetId,
} from "@/utils/category-interaction";

type Category = {
  id: CampusCategory;
  label: string;
  icon: IconName;
};

const allCategory: Category = { id: "all", label: "All", icon: "grid" };
const primaryCategories = campusCategories.filter((category) => category.primary);
const moreCategories = campusCategories.filter((category) => !category.primary);

export function CategoryList() {
  const {
    activeCategory,
    finishCategoryBrowse,
    selectCategory: updateCategory,
    setQuery,
  } = useCampusExplorer();
  const [showMore, setShowMore] = useState(false);
  const activeCategoryRef = useRef(activeCategory);

  useLayoutEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  function selectCategory(category: CampusCategory) {
    const intent = getCategoryClickIntent(activeCategoryRef.current, category);

    if (intent === "preview") {
      activeCategoryRef.current = category;
      updateCategory(category);
    } else {
      finishCategoryBrowse();
      setQuery("");
    }

    const targetId =
      intent === "preview"
        ? "map-heading"
        : getCategoryOverviewTargetId(category);

    requestAnimationFrame(() => {
      const target = document.getElementById(targetId) ?? document.getElementById("map-heading");
      target?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function categoryButton(category: Category) {
    const isActive = activeCategory === category.id;

    return (
      <button
        key={category.id}
        type="button"
        aria-pressed={isActive}
        onClick={() => {
          selectCategory(category.id);
          setShowMore(false);
        }}
        className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center text-xs font-semibold ring-1 ring-inset transition ${
          isActive
            ? "bg-emerald-700 text-white ring-emerald-700"
            : "bg-white text-slate-700 ring-slate-200 hover:-translate-y-0.5 hover:ring-emerald-300"
        }`}
      >
        <span className={`grid size-9 place-items-center rounded-xl ${isActive ? "bg-white/15" : "bg-emerald-50 text-emerald-700"}`}>
          <AppIcon name={category.icon} className="size-5" />
        </span>
        <span className="leading-4">{category.label}</span>
      </button>
    );
  }

  const activeMoreCategory = moreCategories.find(
    (category) => category.id === activeCategory,
  );

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
        {categoryButton(allCategory)}
        {primaryCategories.map((category) =>
          categoryButton({ id: category.id, label: category.shortLabel, icon: category.icon }),
        )}
        <button
          type="button"
          aria-expanded={showMore}
          aria-controls="more-campus-categories"
          onClick={() => setShowMore((isOpen) => !isOpen)}
          className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center text-xs font-semibold ring-1 ring-inset transition ${
            showMore || activeMoreCategory
              ? "bg-slate-900 text-white ring-slate-900"
              : "bg-white text-slate-700 ring-slate-200 hover:ring-emerald-300"
          }`}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-white/10">
            <AppIcon name="grid" className="size-5" />
          </span>
          <span className="leading-4">{activeMoreCategory?.shortLabel ?? "More"}</span>
        </button>
      </div>

      {showMore && (
        <div id="more-campus-categories" className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:grid-cols-4">
          {moreCategories.map((category) => {
            const count = campusPlacesInCategory(category.id).length;

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={activeCategory === category.id}
                onClick={() => {
                  selectCategory(category.id);
                  setShowMore(false);
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ring-1 ring-inset transition ${
                  activeCategory === category.id
                    ? "bg-emerald-700 text-white ring-emerald-700"
                    : "bg-stone-50 text-slate-700 ring-slate-200 hover:bg-emerald-50"
                }`}
              >
                <AppIcon name={category.icon} className="size-5 shrink-0" />
                <span className="min-w-0 flex-1">{category.label}</span>
                <span className="text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
