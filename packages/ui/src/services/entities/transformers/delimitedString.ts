import { ValueTransformer } from "typeorm"

const delimitedString = (delimiter: string): ValueTransformer => ({
  to: (value?: string[]) => value?.join(delimiter),
  from: (value?: string) => value?.split(delimiter).filter(Boolean) ?? []
})

export default delimitedString
