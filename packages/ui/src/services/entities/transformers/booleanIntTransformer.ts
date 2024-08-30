import { ValueTransformer } from "typeorm"

const booleanIntTransformer: ValueTransformer = {
  to: (value) => (value ? 1 : 0),
  from: (value) => value !== 0
}

export default booleanIntTransformer
