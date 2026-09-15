import type { ValueTransformer } from "typeorm"

const jsonTransformer: ValueTransformer = {
  from: (value) => value ?? {},
  to: (value) => value
}

export default jsonTransformer
