/**
 * WCAG 2.4.1 (Bypass Blocks) skip link. Visually hidden until keyboard-focused,
 * so sighted mouse users never see it but keyboard/screen-reader users can jump
 * straight past the nav (and, on /about, the search form) to page content.
 */
export function SkipToContentLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
    >
      Skip to content
    </a>
  );
}
