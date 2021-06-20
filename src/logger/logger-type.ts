import { AwesomeLoggerDefinitions } from './logger-definitions';

export type ExtractLoggerType<A, T> = A extends { type: T } ? A : never;
export type LoggerConfig<T> = Partial<ExtractLoggerType<AwesomeLoggerDefinitions, T>['config']>;
export type LoggerReturnType<T> = ExtractLoggerType<AwesomeLoggerDefinitions, T>['returnValue'];
export type AwesomeLoggerType = AwesomeLoggerDefinitions['type'];
