import { describe, expect, it } from "vitest";
import {
  getLocationErrorMessage,
  locationStatusForErrorCode,
} from "@/utils/geolocation";

describe("geolocation status helpers", () => {
  it("maps browser error codes to distinct states", () => {
    expect(locationStatusForErrorCode(1)).toBe("permission-denied");
    expect(locationStatusForErrorCode(2)).toBe("position-unavailable");
    expect(locationStatusForErrorCode(3)).toBe("timeout");
    expect(locationStatusForErrorCode(99)).toBe("position-unavailable");
  });

  it("provides guidance only for failure states", () => {
    expect(getLocationErrorMessage("idle")).toBeUndefined();
    expect(getLocationErrorMessage("ready")).toBeUndefined();
    expect(getLocationErrorMessage("permission-denied")).toContain("denied");
    expect(getLocationErrorMessage("position-unavailable")).toContain("unavailable");
    expect(getLocationErrorMessage("timeout")).toContain("in time");
    expect(getLocationErrorMessage("unsupported")).toContain("does not support");
  });
});
