import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const targets = [
  ".turbo",
  "coverage",
  "apps/web/.next",
  "apps/admin/.next",
  "apps/api/dist",
  "packages/design-tokens/dist",
  "packages/shared-types/dist",
  "packages/validation/dist",
  "packages/api-contracts/dist",
  "packages/typescript-config/dist"
];

await Promise.all(targets.map((target) => rm(resolve(target), { recursive: true, force: true })));

console.log("Cleaned generated workspace outputs.");
