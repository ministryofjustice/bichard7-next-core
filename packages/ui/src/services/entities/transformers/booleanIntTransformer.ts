import type { ValueTransformer } from "typeorm"

const booleanIntTransformer: ValueTransformer = {
  from: (value) => value !== 0,
  to: (value) => (value ? 1 : 0)
}

export default booleanIntTransformer
