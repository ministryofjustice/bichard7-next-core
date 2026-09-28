import type SensitiveFn from "../types/SensitiveFn"
import anonymiseText from "./anonymiseText"

const sensitiveFn: (redactSensitiveData: boolean) => SensitiveFn =
  (redactSensitiveData: boolean) => (text: string | string[] | undefined, anonymiseSensitiveText?: boolean) => {
    if (!text) {
      return undefined
    }

    if (redactSensitiveData && !anonymiseSensitiveText) {
      return
    }

    if (redactSensitiveData && anonymiseSensitiveText) {
      return Array.isArray(text) ? text.map(anonymiseText) : anonymiseText(text)
    } else {
      return text
    }
  }

export default sensitiveFn
