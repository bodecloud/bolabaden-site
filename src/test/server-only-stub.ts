// Vitest stub for the `server-only` specifier, which Next.js resolves via its
// own bundler rather than a real installed package — see vitest.config.ts's
// resolve.alias. No-op: the guard it normally provides (fail client bundling)
// isn't meaningful outside a Next.js build.
export {};
