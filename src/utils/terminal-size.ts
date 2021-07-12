import { Stdout } from '../render/stdout';

export class TerminalSize {
  private static get terminalSize() {
    return Stdout.getInstance()?.getWindowSize?.() ?? [150, 10];
  }

  public static get terminalHeight() {
    return this.terminalSize[1];
  }

  public static get terminalWidth() {
    return this.terminalSize[0];
  }
}
