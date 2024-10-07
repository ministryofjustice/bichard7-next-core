import { ValueTransformer } from "typeorm"

const jsonTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => value ?? {}
}

export default jsonTransformer
