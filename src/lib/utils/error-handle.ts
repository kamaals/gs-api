/* istanbul ignore file */
export class ServerError extends Error {
  public code: string;
  public port: number;
  constructor(message: string, code: string, port: number) {
    super(message);
    this.name = "ServerError";
    this.code = code;
    this.port = port;
  }
}

export const handleError = (
  err: unknown | (unknown & { message?: string }),
) => {
  const withMessage = err as unknown & { message?: string };

  return withMessage.message ? withMessage.message : "Something went wrong";
};
