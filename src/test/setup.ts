// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

declare module "vitest" {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toBeVisible(): T;
    toBeInTheVisible(): T;
    toHaveTextContent(text: string): T;
  }
}
