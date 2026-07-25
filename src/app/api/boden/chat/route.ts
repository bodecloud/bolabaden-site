import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { proxyBodenChat } from "@/lib/bodenai";

export async function POST(request: NextRequest) {
  if (!config.BODENAI_ENABLED) {
    return NextResponse.json(
      { error: "BodenAI disabled — enable after brain is indexed" },
      { status: 503 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  try {
    const upstream = await proxyBodenChat(body);
    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { error: "twin upstream error", detail: text.slice(0, 500) },
        { status: upstream.status },
      );
    }
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "twin unreachable",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 502 },
    );
  }
}
