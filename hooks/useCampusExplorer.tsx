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
  browsingCategory?: CampusPlaceCategory;
  query: string;
  selectedBusStopId?: string;
  selectedPlace?: CampusPlace;
  selectionVersion: number;
  finishCategoryBrowse: () => void;
  selectCategory: (category: CampusCategory) => void;
  selectBusStop: (stopId: string) => void;
  selectPlace: (place: CampusPlace, options?: { clearSearch?: boolean }) => void;
  setQuery: (query: string) => void;
};

const CampusExplorerContext = createContext<CampusExplorerContextValue | null>(null);

export type CampusExplorerState = {
  activeCategory: CampusCategory;
  browsingCategory?: CampusPlaceCategory;
  query: string;
  selectedBusStopId?: string;
  selectedPlace?: CampusPlace;
  selectionVersion: number;
};

type CampusExplorerAction =
  | { type: "category-selected"; category: CampusCategory }
  | { type: "category-browse-finished" }
  | { type: "query-changed"; query: string }
  | { type: "bus-stop-selected"; stopId: string }
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
    return {
      ...state,
      activeCategory: action.category,
      browsingCategory: action.category === "all" ? undefined : action.category,
      selectedBusStopId:
        action.category === "all" || action.category === "bus_stop"
          ? state.selectedBusStopId
          : undefined,
      selectedPlace,
    };
  }

  if (action.type === "category-browse-finished") {
    return { ...state, browsingCategory: undefined };
  }

  if (action.type === "query-changed") {
    return { ...state, query: action.query };
  }

  if (action.type === "bus-stop-selected") {
    return {
      ...state,
      activeCategory: "bus_stop",
      browsingCategory: undefined,
      selectedBusStopId: action.stopId,
      selectedPlace: undefined,
      selectionVersion: state.selectionVersion + 1,
    };
  }

  return {
    ...state,
    activeCategory: categoryForPlace(action.place.category),
    query: action.clearSearch ? "" : state.query,
    browsingCategory: undefined,
    selectedBusStopId: undefined,
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

  const finishCategoryBrowse = useCallback(() => {
    dispatch({ type: "category-browse-finished" });
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

  const selectBusStop = useCallback((stopId: string) => {
    dispatch({ type: "bus-stop-selected", stopId });
  }, []);

  const setQuery = useCallback((query: string) => {
    dispatch({ type: "query-changed", query });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      finishCategoryBrowse,
      selectCategory,
      selectBusStop,
      selectPlace,
      setQuery,
    }),
    [state, finishCategoryBrowse, selectBusStop, selectCategory, selectPlace, setQuery],
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
