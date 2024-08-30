import { ValueTransformer } from "typeorm"

const delimitedString = (delimeter: string): ValueTransformer => ({
  to: (value: string[]) => value.join(delimeter),
  from: (value?: string) => value?.split(delimeter).filter(Boolean) ?? []
})

export default delimitedString
