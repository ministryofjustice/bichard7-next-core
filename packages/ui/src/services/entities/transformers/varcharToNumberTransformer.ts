import type { ValueTransformer } from "typeorm"

const varcharToNumberTransformer: ValueTransformer = {
  to: (value) => String(value),
  from: (value) => (isNaN(value) ? null : Number(value))
}

export default varcharToNumberTransformer
