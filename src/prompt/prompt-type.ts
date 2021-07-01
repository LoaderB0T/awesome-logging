import { AwesomePromptDefinitions } from './prompt-definitions';

export type ExtractPromptType<A, T> = A extends { type: T } ? A : never;
export type PromptConfig<T> = Partial<ExtractPromptType<AwesomePromptDefinitions, T>['config']>;
export type PromptReturnType<T> = ExtractPromptType<AwesomePromptDefinitions, T>['returnValue'];
export type AwesomePromptType = AwesomePromptDefinitions['type'];
