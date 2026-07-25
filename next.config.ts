import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.DEPLOY_TARGET === "github-pages";
const pagesBasePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || "/home";

const nextConfig: NextConfig = {
  output: isGithubPagesBuild ? "export" : "standalone",
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isGithubPagesBuild ? "true" : "false",
  },
  outputFileTracingIncludes: isGithubPagesBuild
    ? undefined
    : {
        "/*": ["./src/content/guides/**/*.md", "./guides/**/*.md"],
      },
  basePath: isGithubPagesBuild ? pagesBasePath : undefined,
  assetPrefix: isGithubPagesBuild ? `${pagesBasePath}/` : undefined,
  trailingSlash: isGithubPagesBuild,
  images: {
    unoptimized: true,
  },
  ...(isGithubPagesBuild
    ? {}
    : {
        async rewrites() {
          return {
            beforeFiles: [
              {
                source: "/",
                destination: "/home/index.html",
              },
            ],
          };
        },
      }),
};

export default nextConfig;
