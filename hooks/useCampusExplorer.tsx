"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CampusPlace, CampusPlaceCategory } from "@/types/campus-place";

export type CampusCategory = "all" | CampusPlaceCategory;

type CampusExplorerContextValue = {
  activeCategory: CampusCategory;
  query: string;
  selectedPlace?: CampusPlace;
  selectionVersion: number;
  selectCategory: (category: CampusCategory) => void;
  selectPlace: (place: CampusPlace, options?: { clearSearch?: boolean }) => void;
  setQuery: (query: string) => void;
};

const CampusExplorerContext = createContext<CampusExplorerContextValue | null>(null);

export type CampusExplorerState = {
  activeCategory: CampusCategory;
  query: string;
  selectedPlace?: CampusPlace;
  selectionVersion: number;
};

type CampusExplorerAction =
  | { type: "category-selected"; category: CampusCategory }
  | { type: "query-changed"; query: string }
  | { type: "place-selected"; place: CampusPlace; clearSearch?: boolean };

export const initialCampusExplorerState: CampusExplorerState = {
  activeCategory: "all",
  query: "",
  selectionVersion: 0,
};

export function categoryForPlace(category: CampusPlaceCategory): CampusCategory {
  return category;
}

export function campusExplorerReducer(
  state: CampusExplorerState,
  action: CampusExplorerAction,
): CampusExplorerState {
  if (action.type === "category-selected") {
    const selectedPlace =
      action.category === "all" || state.selectedPlace?.category === action.category
        ? state.selectedPlace
        : undefined;
    return { ...state, activeCategory: action.category, selectedPlace };
  }

  if (action.type === "query-changed") {
    return { ...state, query: action.query };
  }

  return {
    ...state,
    activeCategory: categoryForPlace(action.place.category),
    query: action.clearSearch ? "" : state.query,
    selectedPlace: action.place,
    selectionVersion: state.selectionVersion + 1,
  };
}

export function CampusExplorerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    campusExplorerReducer,
    initialCampusExplorerState,
  );

  const selectCategory = useCallback((category: CampusCategory) => {
    dispatch({ type: "category-selected", category });
  }, []);

  const selectPlace = useCallback(
    (place: CampusPlace, options?: { clearSearch?: boolean }) => {
      dispatch({
        type: "place-selected",
        place,
        clearSearch: options?.clearSearch,
      });
    },
    [],
  );

  const setQuery = useCallback((query: string) => {
    dispatch({ type: "query-changed", query });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      selectCategory,
      selectPlace,
      setQuery,
    }),
    [state, selectCategory, selectPlace, setQuery],
  );

  return (
    <CampusExplorerContext.Provider value={value}>
      {children}
    </CampusExplorerContext.Provider>
  );
}

export function useCampusExplorer() {
  const context = useContext(CampusExplorerContext);
  if (!context) {
    throw new Error("useCampusExplorer must be used within CampusExplorerProvider");
  }
  return context;
}
