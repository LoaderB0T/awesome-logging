export type ExtractLoggerType<A, T> = A extends { type: T } ? A : never;
