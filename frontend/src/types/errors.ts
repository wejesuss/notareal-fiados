export type UIErrorType = "not_found" | "validation" | "unknown";

export class UIError<T = unknown> extends Error {
  constructor(
    message: string,
    public type: UIErrorType,
    public original: T
  ) {
    super(message);
  }
}
