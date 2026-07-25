import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { fetchBodenHealth } from "@/lib/bodenai";

export async function GET() {
  if (!config.BODENAI_ENABLED) {
    return NextResponse.json({
      ok: false,
      enabled: false,
      ui: config.BODENAI_UI_PUBLIC,
      error: "BodenAI disabled",
    });
  }
  const health = await fetchBodenHealth();
  return NextResponse.json({
    ...health,
    enabled: true,
    ui: config.BODENAI_UI_PUBLIC,
  });
}
