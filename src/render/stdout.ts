export class Stdout {
  write: (str: string) => boolean;
  getWindowSize: () => [number, number];
  private static _instance?: Stdout;

  constructor() {
    this.write = (str: string) => process.stdout?.write(str);
    this.getWindowSize = () => process.stdout?.getWindowSize?.();
  }

  public static getInstance() {
    this._instance ??= new Stdout();
    return this._instance;
  }
}
