import { TextObject } from '../../models/text-object';
import { AwesomeLoggerBase } from '../models/logger-base';
import { AwesomeLoggerMultiControl, AwesomeLoggerMultiConfig } from './config/multi';

export class AwesomeMultiLogger extends AwesomeLoggerBase implements AwesomeLoggerMultiControl {
  private readonly _children: AwesomeLoggerBase[];

  constructor(config?: Partial<AwesomeLoggerMultiConfig>) {
    super();
    this._children = config?.children ?? [];
  }

  public needsScroll() {
    return true;
  }

  public hasChanges(): boolean {
    return this._children.some(x => x.hasChanges());
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return (calledFrom === this || this._children.some(x => x.canBeCalledFrom(calledFrom)));
  }

  public getChild<T extends AwesomeLoggerBase>(index: number): T {
    return this._children[index] as T;
  }

  public getNextLine(): TextObject {
    const res: TextObject = this._children[0].render();
    let latestChild: TextObject = this._children[0].render();
    let first = true;
    this._children.forEach(child => {
      if (!first) {
        latestChild = latestChild.appendLine(child.render());
      } else {
        first = false;
      }
    });
    return res;
  }
}
