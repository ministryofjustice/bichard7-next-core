import type { ValueTransformer } from "typeorm"

const delimitedString = (delimiter: string): ValueTransformer => ({
  from: (value?: string) => value?.split(delimiter).filter(Boolean) ?? [],
  to: (value?: string[]) => value?.join(delimiter)
})

export default delimitedString
