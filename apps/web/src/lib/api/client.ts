import type { ApiItemResponse, ApiPageResponse } from "@raina/api-contracts";
import type { ApiError } from "@raina/shared-types";

import { RainaApiError } from "./errors";

const defaultApiBaseUrl = "http://localhost:4000/api/v1";
const requestTimeoutMs = 8000;

export type ApiQueryValue = string | number | boolean | null | undefined;
export type ApiQueryParams = Record<string, ApiQueryValue | readonly ApiQueryValue[]>;

export interface ApiRequestOptions {
  query?: ApiQueryParams;
  timeoutMs?: number;
}

export function getApiBaseUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? defaultApiBaseUrl;
  return configuredUrl.replace(/\/+$/, "");
}

export function buildQueryString(query?: ApiQueryParams): string {
  if (query === undefined) return "";

  const params = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value === undefined || value === null || value === "") continue;
      params.append(key, String(value));
    }
  }

  const serialized = params.toString();
  return serialized.length > 0 ? `?${serialized}` : "";
}

export async function apiRequest<TData>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<TData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? requestTimeoutMs);
  const url = `${getApiBaseUrl()}${normalizePath(path)}${buildQueryString(options.query)}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });
    const requestId = response.headers.get("x-request-id") ?? undefined;
    const payload = await readJson(response);

    if (!response.ok) {
      throw new RainaApiError(response.status, normalizeApiError(payload, requestId));
    }

    return payload as TData;
  } catch (error) {
    if (error instanceof RainaApiError) throw error;
    if (isAbortError(error)) {
      throw new RainaApiError(408, {
        code: "API_TIMEOUT",
        message: "استغرق تحميل البيانات وقتا أطول من المتوقع."
      });
    }

    console.warn("Raina API request failed safely", {
      path,
      message: error instanceof Error ? error.message : "unknown"
    });
    throw new RainaApiError(503, {
      code: "API_OFFLINE",
      message: "تعذر الاتصال بخدمة رأينا. تأكد أن الـ API يعمل ثم أعد المحاولة."
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiGetPage<TItem>(
  path: string,
  options?: ApiRequestOptions
): Promise<ApiPageResponse<TItem>> {
  return apiRequest<ApiPageResponse<TItem>>(path, options);
}

export async function apiGetData<TItem>(path: string, options?: ApiRequestOptions): Promise<TItem> {
  const response = await apiRequest<ApiItemResponse<TItem>>(path, options);
  return response.data;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.length === 0) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function normalizeApiError(payload: unknown, requestId?: string): ApiError {
  if (isApiError(payload)) {
    return {
      code: payload.code,
      message: payload.message,
      details: payload.details,
      requestId: payload.requestId ?? requestId
    };
  }

  if (isRecord(payload) && isApiError(payload.error)) {
    return {
      code: payload.error.code,
      message: payload.error.message,
      details: payload.error.details,
      requestId: payload.error.requestId ?? requestId
    };
  }

  return {
    code: "API_ERROR",
    message: "تعذر تحميل البيانات",
    requestId
  };
}

function isApiError(value: unknown): value is ApiError {
  return isRecord(value) && typeof value.code === "string" && typeof value.message === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
