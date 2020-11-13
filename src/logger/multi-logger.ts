import { TextObject } from '../models/text-object';
import { AwesomeLoggerMultiConfig, AwesomeLoggerMultiControl } from '../models/config/multi';
import { AwesomeLoggerBase } from '../models/logger-base';

export class AwesomeMultiLogger<T> extends AwesomeLoggerBase implements AwesomeLoggerMultiControl {
  private _children: AwesomeLoggerBase[];

  constructor(config: Partial<AwesomeLoggerMultiConfig>) {
    super();
    this._children = config.children ?? [];
  }

  public hasChanges(): boolean {
    return this._children.some(x => x.hasChanges());
  }

  getChild<T extends AwesomeLoggerBase>(index: number): T {
    return this._children[index] as T;
  }

  getNextLine(): string | TextObject | TextObject[] {
    return this._children.map(child => child['render']()).join('\n');
  }
}
