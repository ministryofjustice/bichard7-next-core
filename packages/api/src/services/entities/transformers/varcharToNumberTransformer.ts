import type { ValueTransformer } from "typeorm"

const varcharToNumberTransformer: ValueTransformer = {
  from: (value) => {
    if (!value || isNaN(value)) {
      return null
    }

    return Number(value)
  },
  to: (value) => {
    if (!value || isNaN(value)) {
      return null
    }

    return Number(value)
  }
}

export default varcharToNumberTransformer
