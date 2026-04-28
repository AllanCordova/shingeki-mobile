import { ApiError } from "@/lib/api";

export type ValidationErrors = Record<string, string>;

export interface ParsedApiError {
  message: string;
  validationErrors: ValidationErrors;
}

export interface ParseApiErrorOptions {
  defaultMessage?: string;
  validationMessage?: string;
  messageFieldKey?: string;
  errorsFieldKey?: string;
  invalidFieldMessage?: string;
}

const DEFAULT_MESSAGE = "An unexpected error occurred. Please try again.";
const DEFAULT_VALIDATION_MESSAGE = "An error occurred.";
const DEFAULT_MESSAGE_FIELD_KEY = "message";
const DEFAULT_ERRORS_FIELD_KEY = "errors";
const DEFAULT_INVALID_FIELD_MESSAGE = "Invalid value.";

function extractValidationErrors(
  data: unknown,
  errorsFieldKey: string,
  invalidFieldMessage: string,
): ValidationErrors {
  if (!data || typeof data !== "object") return {};

  const errors = (data as Record<string, unknown>)[errorsFieldKey];
  if (!errors || typeof errors !== "object") return {};

  const entries = Object.entries(errors as Record<string, unknown>);
  const mapped = entries.map(([field, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      return [field, String(value[0])];
    }

    if (typeof value === "string" && value.trim()) {
      return [field, value];
    }

    return [field, invalidFieldMessage];
  });

  return Object.fromEntries(mapped);
}

export function parseApiError(
  error: unknown,
  options: ParseApiErrorOptions = {},
): ParsedApiError {
  const defaultMessage = options.defaultMessage ?? DEFAULT_MESSAGE;
  const validationMessage =
    options.validationMessage ?? DEFAULT_VALIDATION_MESSAGE;
  const messageFieldKey = options.messageFieldKey ?? DEFAULT_MESSAGE_FIELD_KEY;
  const errorsFieldKey = options.errorsFieldKey ?? DEFAULT_ERRORS_FIELD_KEY;
  const invalidFieldMessage =
    options.invalidFieldMessage ?? DEFAULT_INVALID_FIELD_MESSAGE;

  if (error instanceof ApiError) {
    if (typeof error.data === "string" && error.data.trim()) {
      return {
        message: error.data,
        validationErrors: {},
      };
    }

    const validationErrors = extractValidationErrors(
      error.data,
      errorsFieldKey,
      invalidFieldMessage,
    );

    if (Object.keys(validationErrors).length > 0) {
      return {
        message: validationMessage,
        validationErrors,
      };
    }

    if (error.data && typeof error.data === "object") {
      const message = (error.data as Record<string, unknown>)[messageFieldKey];

      if (typeof message === "string" && message.trim()) {
        return {
          message,
          validationErrors,
        };
      }
    }

    return {
      message: defaultMessage,
      validationErrors,
    };
  }

  if (error instanceof Error && error.message.trim()) {
    return {
      message: error.message,
      validationErrors: {},
    };
  }

  return {
    message: defaultMessage,
    validationErrors: {},
  };
}
