export class QwenClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly retryable: boolean;

  constructor(
    status: number,
    code: string,
    message: string,
    retryable = false,
  ) {
    super(message);
    this.name = "QwenClientError";
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

export function safeQwenError(error: unknown) {
  if (error instanceof QwenClientError) {
    return {
      status: "error" as const,
      error: {
        code: error.code,
        message: error.message,
        retryable: error.retryable,
      },
    };
  }

  return {
    status: "error" as const,
    error: {
      code: "SERVICE_UNAVAILABLE",
      message: "The research assistant is temporarily unavailable.",
      retryable: true,
    },
  };
}
