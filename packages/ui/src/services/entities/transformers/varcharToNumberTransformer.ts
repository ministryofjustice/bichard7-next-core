import type { ValueTransformer } from "typeorm"

const varcharToNumberTransformer: ValueTransformer = {
  to: (value) => {
    if (!value || isNaN(value)) {
      return null
    }

    return Number(value)
  },
  from: (value) => {
    if (!value || isNaN(value)) {
      return null
    }

    return Number(value)
  }
}

export default varcharToNumberTransformer
