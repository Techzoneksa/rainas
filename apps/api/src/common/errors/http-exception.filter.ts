import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

import type { ApiError } from "@raina/shared-types";

import type { RequestWithId } from "../middleware/request-id.middleware";

interface JsonResponse {
  status(code: number): JsonResponse;
  json(body: ApiError): void;
}

interface HttpExceptionPayload {
  code?: string;
  message?: string | string[];
  error?: string;
  details?: Record<string, unknown>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<JsonResponse>();
    const request = context.getRequest<RequestWithId>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = this.getExceptionResponse(exception);
    const rawMessage = exceptionResponse?.message ?? exceptionResponse?.error;
    const message = Array.isArray(rawMessage)
      ? "تعذر تنفيذ الطلب بسبب مدخلات غير صحيحة."
      : (rawMessage ??
        (status === HttpStatus.INTERNAL_SERVER_ERROR ? "حدث خطأ غير متوقع." : "تعذر تنفيذ الطلب."));

    const body: ApiError = {
      code:
        exceptionResponse?.code ??
        (status === HttpStatus.INTERNAL_SERVER_ERROR ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR"),
      message
    };

    const details = this.getDetails(exceptionResponse);
    if (details !== undefined) {
      body.details = details;
    }

    if (request.requestId !== undefined) {
      body.requestId = request.requestId;
    }

    response.status(status).json(body);
  }

  private getExceptionResponse(exception: unknown): HttpExceptionPayload | undefined {
    if (!(exception instanceof HttpException)) return undefined;
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === "string") {
      return { message: exceptionResponse };
    }
    if (this.isRecord(exceptionResponse)) {
      return exceptionResponse;
    }
    return undefined;
  }

  private getDetails(
    payload: HttpExceptionPayload | undefined
  ): Record<string, unknown> | undefined {
    if (payload?.details !== undefined) return payload.details;
    if (Array.isArray(payload?.message)) {
      return { validation: payload.message };
    }
    return undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
}
