// @internal
export const ConsoleLog: { log: (val?: string) => void } = {
  log: () => {
    // This will be replaced in the constructor of LoggerManager by the original console.log
  }
};
