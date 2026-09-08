import type { ValueTransformer } from "typeorm"

const dateTransformer: ValueTransformer = {
  from: (value) => (value !== null ? new Date(value) : null),
  to: (value) => value
}

export default dateTransformer
