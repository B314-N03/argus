// /// <reference types="vitest" />
// import react from "@vitejs/plugin-react-swc";
// import { playwright } from "@vitest/browser-playwright";
// import { defineConfig } from "vitest/config";

// export default defineConfig({
//     plugins: [react()],
//     resolve: {
//         alias: {
//             "@": "/src",
//         },
//     },
//     optimizeDeps: {
//         include: [
//             "react-dom/client",
//             "@tanstack/react-query-devtools",
//             "@tanstack/react-router-devtools",
//         ],
//     },
//     test: {
//         globals: true,
//         setupFiles: ["./src/test/setup.ts"],
//         coverage: {
//             provider: "istanbul",
//             reporter: ["text", "json", "html"],
//             include: ["src/**/*.ts", "src/**/*.tsx", "orval/**/*.{ts,tsx,js,jsx}"],
//             clean: true,
//             thresholds: {
//                 branches: 80,
//                 functions: 80,
//                 lines: 80,
//                 statements: 80,
//             },
//             exclude: [],
//         },
//         css: true,
//         include: [
//             "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
//             "orval/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
//         ],
//         exclude: ["node_modules", "dist", ".next", ".nuxt"],
//         browser: {
//             enabled: true,
//             provider: playwright(),
//             instances: [{ browser: "chromium" }],
//             headless: false,
//             screenshotFailures: false,
//         },
//     },
// });