import { NextResponse } from "next/server";
import { runCommand } from "@/lib/play/store";

const SESSION_HEADER = "x-play-json";

async function readCommandPayload(request: Request): Promise<{
  sessionId: string | null;
  command: string;
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      sessionId?: string;
      command?: string;
    };
    return {
      sessionId: body.sessionId?.trim() ?? null,
      command: body.command?.trim() ?? "",
    };
  }

  const formData = await request.formData();
  return {
    sessionId: String(formData.get("sessionId") ?? "").trim() || null,
    command: String(formData.get("command") ?? "").trim(),
  };
}

export async function POST(request: Request) {
  const wantsJson =
    request.headers.get(SESSION_HEADER) === "1" ||
    (request.headers.get("accept") ?? "").includes("application/json");

  const { sessionId, command } = await readCommandPayload(request);
  const outcome = runCommand(sessionId, command);

  if (wantsJson) {
    return NextResponse.json({
      sessionId: outcome.snapshot.sessionId,
      snapshot: outcome.snapshot,
      reply: outcome.reply,
      glitch: outcome.glitch ?? false,
    });
  }

  const redirectUrl = new URL("/play", request.url);
  redirectUrl.searchParams.set("session", outcome.snapshot.sessionId);

  const response = NextResponse.redirect(redirectUrl, 303);
  response.cookies.set("play-session", outcome.snapshot.sessionId, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
  return response;
}

