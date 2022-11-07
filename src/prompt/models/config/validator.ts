export type AwesomePromptValidator = {
  skipStyling?: boolean;
  description: string;
  validator: (val: any) => boolean | Promise<boolean>;
};
