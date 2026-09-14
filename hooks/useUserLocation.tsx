"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Coordinates } from "@/utils/distance";
import {
  locationStatusForErrorCode,
  type LocationStatus,
} from "@/utils/geolocation";

type UserLocationContextValue = {
  location?: Coordinates;
  requestLocation: () => void;
  status: LocationStatus;
};

const UserLocationContext = createContext<UserLocationContextValue | null>(null);

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Coordinates>();
  const [status, setStatus] = useState<LocationStatus>("idle");

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setStatus("ready");
      },
      (error) => setStatus(locationStatusForErrorCode(error.code)),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }

  return (
    <UserLocationContext.Provider value={{ location, requestLocation, status }}>
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation() {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error("useUserLocation must be used within UserLocationProvider");
  }
  return context;
}
