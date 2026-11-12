export enum DateCode {
  ON_OR_IN = 1,
  BEFORE = 2,
  AFTER = 3,
  BETWEEN = 4,
  ON_OR_ABOUT = 5,
  ON_OR_BEFORE = 6
}

export const DateCodes: Record<DateCode, string> = {
  [DateCode.ON_OR_IN]: "on or in",
  [DateCode.BEFORE]: "before",
  [DateCode.AFTER]: "after",
  [DateCode.BETWEEN]: "between",
  [DateCode.ON_OR_ABOUT]: "on or about",
  [DateCode.ON_OR_BEFORE]: "on or before"
}
