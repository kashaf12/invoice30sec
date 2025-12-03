import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Performance: prevent console.log in production
      "no-console": ["error", { allow: ["warn", "error"] }],
      // Performance: prefer next/image over img tags
      "@next/next/no-img-element": "error",
    },
  },
]);

export default eslintConfig;
