import { ValueTransformer } from "typeorm"

const dateTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => (value !== null ? new Date(value) : null)
}

export default dateTransformer
