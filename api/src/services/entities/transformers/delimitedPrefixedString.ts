import type { ValueTransformer } from "typeorm"

const delimitedPrefixedString = (delimeter: string, prefix: string): ValueTransformer => ({
  to: (value: string[]) => value.map((f) => prefix + f).join(delimeter),
  from: (value?: string) =>
    value
      ?.split(delimeter)
      .map((f) => f.substring(prefix.length))
      ?.filter((force) => force != "") ?? []
})

export default delimitedPrefixedString
