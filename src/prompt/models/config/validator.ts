export type AwesomePromptValidator = {
  id?: string | number;
  skipStyling?: boolean;
  description: string;
  validator: (val: any) => boolean | Promise<boolean>;
};
