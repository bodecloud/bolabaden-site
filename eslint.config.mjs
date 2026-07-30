import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
      "prefer-const": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            "Inline styles are not allowed. Use Tailwind utility classes or shared CSS. OpenGraph ImageResponse files are exempt.",
        },
      ],
    },
  },
  {
    files: [
      "src/app/opengraph-image.tsx",
      "src/app/about/opengraph-image.tsx",
      "src/app/contact/opengraph-image.tsx",
      "src/app/guides/opengraph-image.tsx",
      "src/app/guides/\\[slug\\]/opengraph-image.tsx",
      "src/app/dashboard/opengraph-image.tsx",
      "src/app/projects/opengraph-image.tsx",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
];

export default eslintConfig;
