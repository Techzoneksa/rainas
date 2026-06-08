import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

export type RequestWithId = IncomingMessage & {
  requestId?: string;
};

type NextFunction = () => void;

export function requestIdMiddleware(
  request: RequestWithId,
  response: ServerResponse,
  next: NextFunction
): void {
  const headerValue = request.headers["x-request-id"];
  const requestId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const safeRequestId = requestId && requestId.length <= 128 ? requestId : randomUUID();

  request.requestId = safeRequestId;
  response.setHeader("x-request-id", safeRequestId);
  next();
}
