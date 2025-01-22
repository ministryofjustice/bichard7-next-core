/* no-underscore-dangle rule disabled as properties are used in this class */

import type PollCondition from "./PollCondition"

export default class PollOptions<T> {
  public set condition(condition: PollCondition<T>) {
    if (!condition) {
      throw new Error("Condition must have a value")
    }

    this._condition = condition
  }

  public get condition(): PollCondition<T> {
    return this._condition
  }

  public set delay(delay: number) {
    if (delay < 0) {
      throw new Error("Delay must be a positive integer")
    }

    this._delay = delay
  }

  public get delay(): number {
    return this._delay
  }

  private _condition: PollCondition<T>

  private _delay = 0

  constructor(public readonly timeout: number) {
    this.condition = (result) => !!result
  }
}
