export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status?: number;
  public readonly details?: unknown;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    code: ApiErrorCode,
    options?: {
      status?: number;
      details?: unknown;
      originalError?: unknown;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = options?.status;
    this.details = options?.details;
    this.originalError = options?.originalError;
  }
}

export class ErrorHandler {
  static fromResponse(status: number, body?: unknown): ApiError {
    const messageFromBody = this.getMessageFromBody(body);

    if (status === 401) {
      return new ApiError(messageFromBody ?? "Unauthorized.", "UNAUTHORIZED", {
        status,
        details: body,
      });
    }

    if (status === 403) {
      return new ApiError(messageFromBody ?? "Access denied.", "FORBIDDEN", {
        status,
        details: body,
      });
    }

    if (status === 404) {
      return new ApiError(
        messageFromBody ?? "Resource not found.",
        "NOT_FOUND",
        {
          status,
          details: body,
        },
      );
    }

    if (status === 422) {
      return new ApiError(
        messageFromBody ?? "Validation failed for the submitted data.",
        "VALIDATION_ERROR",
        {
          status,
          details: body,
        },
      );
    }

    if (status >= 500) {
      return new ApiError(
        "An unexpected server error occurred.",
        "SERVER_ERROR",
        {
          status,
        },
      );
    }

    return new ApiError(messageFromBody ?? "Request failed.", "UNKNOWN_ERROR", {
      status,
      details: body,
    });
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return new ApiError("The request timed out.", "TIMEOUT", {
        originalError: error,
      });
    }

    if (error instanceof TypeError) {
      return new ApiError(
        "Network error or service unavailable.",
        "NETWORK_ERROR",
        {
          originalError: error,
        },
      );
    }

    return new ApiError(
      "Unexpected error while communicating with the API.",
      "UNKNOWN_ERROR",
      {
        originalError: error,
      },
    );
  }

  private static getMessageFromBody(body: unknown): string | undefined {
    if (!body || typeof body !== "object") {
      return undefined;
    }

    const maybeBody = body as Record<string, unknown>;

    if (typeof maybeBody.message === "string" && maybeBody.message.trim()) {
      return maybeBody.message;
    }

    if (typeof maybeBody.error === "string" && maybeBody.error.trim()) {
      return maybeBody.error;
    }

    return undefined;
  }
}
