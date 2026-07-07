import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PlaySurface } from "@/components/play/play-surface";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import { createAndStoreSession, getSnapshot } from "@/lib/play/store";

export const metadata: Metadata = buildPageMetadata({
  title: config.PLAY_PAGE_TITLE,
  description: config.PLAY_PAGE_DESCRIPTION,
  pathname: "/play",
});

type PlayPageProps = {
  searchParams: Promise<{ session?: string }>;
};

export default async function PlayPage({ searchParams }: PlayPageProps) {
  if (config.STATIC_EXPORT) {
    return (
      <PlaySurface
        initialSnapshot={getSnapshot("static-preview")}
        staticPreview
      />
    );
  }

  const params = await searchParams;
  const cookieStore = await cookies();
  const cookieSessionId = cookieStore.get("play-session")?.value?.trim();
  const sessionId = params.session?.trim() || cookieSessionId || null;

  if (!sessionId) {
    const session = createAndStoreSession();
    redirect(`/play?session=${session.sessionId}`);
  }

  return <PlaySurface initialSnapshot={getSnapshot(sessionId)} />;
}
