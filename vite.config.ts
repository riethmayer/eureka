/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"], // Adjust the include pattern if necessary
    coverage: {
      provider: "v8",
      reporter: ["json-summary", "json"],
      all: true,
      include: ["src/**/*.ts", "src/**/*.tsx"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
