import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

import type { ApiError } from "@raina/shared-types";

import type { RequestWithId } from "../middleware/request-id.middleware";

interface JsonResponse {
  status(code: number): JsonResponse;
  json(body: ApiError): void;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<JsonResponse>();
    const request = context.getRequest<RequestWithId>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : status === HttpStatus.INTERNAL_SERVER_ERROR
          ? "حدث خطأ غير متوقع"
          : "تعذر تنفيذ الطلب";

    const body: ApiError = {
      code: status === HttpStatus.INTERNAL_SERVER_ERROR ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      message
    };

    if (request.requestId !== undefined) {
      body.requestId = request.requestId;
    }

    response.status(status).json(body);
  }
}
