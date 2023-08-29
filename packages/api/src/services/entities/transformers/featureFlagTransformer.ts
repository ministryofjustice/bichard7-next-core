import type { ValueTransformer } from "typeorm"

const featureFlagTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => value ?? {}
}

export default featureFlagTransformer
