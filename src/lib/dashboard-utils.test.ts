import { describe, expect, it } from "vitest";
import {
  formatBytes,
  formatNumber,
  generateSparklinePoints,
  getCategoryDisplayName,
  getHealthBgColor,
  getHealthColor,
  getStatusConfig,
} from "./dashboard-utils";

describe("formatNumber", () => {
  it("adds comma separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("leaves small numbers untouched", () => {
    expect(formatNumber(42)).toBe("42");
  });
});

describe("formatBytes", () => {
  it("special-cases zero", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  it("formats bytes below 1KB with the Bytes unit", () => {
    expect(formatBytes(512)).toBe("512 Bytes");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(2048)).toBe("2 KB");
  });

  it("formats gigabytes with two decimal places when not exact", () => {
    expect(formatBytes(1.5 * 1024 * 1024 * 1024)).toBe("1.5 GB");
  });
});

describe("getHealthColor", () => {
  it("treats higher as worse by default (e.g. CPU usage)", () => {
    expect(getHealthColor(95)).toBe("health-critical");
    expect(getHealthColor(10)).toBe("health-excellent");
  });

  it("treats higher as better when inverse=true (e.g. uptime)", () => {
    expect(getHealthColor(99, true)).toBe("uptime-excellent");
    expect(getHealthColor(50, true)).toBe("uptime-poor");
  });

  it("is inclusive at threshold boundaries", () => {
    expect(getHealthColor(90)).toBe("health-critical");
    expect(getHealthColor(89.9)).toBe("health-poor");
  });
});

describe("getHealthBgColor", () => {
  it("treats higher as worse by default", () => {
    expect(getHealthBgColor(95)).toBe("status-offline");
    expect(getHealthBgColor(10)).toBe("status-online");
  });

  it("treats higher as better when inverse=true", () => {
    expect(getHealthBgColor(99, true)).toBe("status-online");
    expect(getHealthBgColor(50, true)).toBe("status-offline");
  });
});

describe("generateSparklinePoints", () => {
  it("returns an empty string for no data", () => {
    expect(generateSparklinePoints([], 100, 50)).toBe("");
  });

  it("maps a flat series (equal min/max) without dividing by zero", () => {
    // range = max - min || 1, so a flat series still produces valid points.
    const points = generateSparklinePoints([5, 5, 5], 100, 50);
    expect(points.split(" ")).toHaveLength(3);
    expect(points).not.toMatch(/NaN/);
  });

  it("produces NaN x-coordinates for a single-point series (documented existing bug)", () => {
    // x = padding + (index / (data.length - 1)) * effectiveWidth
    // with data.length === 1, that's index / 0 = NaN for index 0.
    // This test pins current behavior; it is not asserting this is desired.
    const points = generateSparklinePoints([42], 100, 50);
    expect(points).toContain("NaN");
  });

  it("spans the full width for a multi-point series", () => {
    const points = generateSparklinePoints([0, 10], 100, 50, 0);
    const [first, last] = points.split(" ");
    expect(first.split(",")[0]).toBe("0");
    expect(last.split(",")[0]).toBe("100");
  });
});

describe("getStatusConfig", () => {
  it("returns the expected color pair for each known status", () => {
    expect(getStatusConfig("online")).toEqual({
      color: "text-green-500",
      bg: "bg-green-500/20",
    });
    expect(getStatusConfig("offline").color).toBe("text-red-500");
    expect(getStatusConfig("maintenance").color).toBe("text-yellow-500");
  });
});

describe("getCategoryDisplayName", () => {
  it("maps known category keys to display names", () => {
    expect(getCategoryDisplayName("ai-ml")).toBe("AI & ML");
    expect(getCategoryDisplayName("infrastructure")).toBe("Infrastructure");
  });

  it("falls back to the raw key for unknown categories", () => {
    expect(getCategoryDisplayName("some-unknown-category")).toBe(
      "some-unknown-category",
    );
  });
});
