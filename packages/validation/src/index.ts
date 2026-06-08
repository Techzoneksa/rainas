import { z } from "zod";

import type { AppEnvironment } from "@raina/shared-types";

export const appEnvironmentSchema = z.enum(["development", "staging", "production", "test"]);

export const portSchema = z.coerce.number().int().min(1).max(65535);

export const idSchema = z.string().min(1).max(128);

export const paginationQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export function parseAppEnvironment(value: unknown): AppEnvironment {
  return appEnvironmentSchema.catch("development").parse(value);
}

export function parsePort(value: unknown, fallback: number): number {
  return portSchema.catch(fallback).parse(value);
}
