import type AddLine from "../types/AddLine"
import anonymiseText from "./anonymiseText"

const addLineFn: (lines: string[], redactSensitiveData: boolean) => AddLine =
  (lines: string[], redactSensitiveData: boolean) =>
  (text: string, condition?: boolean | (() => boolean), isSensitive?: boolean, anonymiseSensitiveText?: boolean) => {
    if (isSensitive && redactSensitiveData && !anonymiseSensitiveText) {
      return
    }

    const conditionResult = condition === undefined || (typeof condition === "boolean" ? condition : condition())
    if (!conditionResult) {
      return
    }

    const tab = " ".repeat(4)
    if (isSensitive && redactSensitiveData && anonymiseSensitiveText) {
      lines.push(anonymiseText(text.replace(/\t/g, tab)))
    } else {
      lines.push(text.replace(/\t/g, tab))
    }
  }

export default addLineFn
