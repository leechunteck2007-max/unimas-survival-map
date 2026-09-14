export type LocationStatus =
  | "idle"
  | "loading"
  | "ready"
  | "permission-denied"
  | "position-unavailable"
  | "timeout"
  | "unsupported";

export function locationStatusForErrorCode(code: number): LocationStatus {
  if (code === 1) return "permission-denied";
  if (code === 2) return "position-unavailable";
  if (code === 3) return "timeout";
  return "position-unavailable";
}

export function getLocationErrorMessage(status: LocationStatus) {
  if (status === "permission-denied") {
    return "Location access was denied. Enable it in your browser settings to use nearby features.";
  }
  if (status === "position-unavailable") {
    return "Your location is currently unavailable. Check your device location service and try again.";
  }
  if (status === "timeout") {
    return "We could not get your location in time. Move to an open area and try again.";
  }
  if (status === "unsupported") {
    return "This browser does not support location. You can still search and browse the campus map.";
  }
  return undefined;
}
