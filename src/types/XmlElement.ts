export type NameSequenceAttribute = {
  NameSequence: string
}

export type LiteralAttribute = {
  Literal?: string
}

export type HasErrorAttribute = {
  hasError: boolean
}

export type ErrorAttribute = {
  Error?: string
}

export type Element<TValue, TAttribute> = {
  value: TValue
  attributes?: TAttribute
}

export type StringElement<TAttributes> = Element<string, TAttributes>

export type StringElementWithError = Element<string | undefined, ErrorAttribute>

export type NumberElementWithError = Element<number, ErrorAttribute>

const createElement = <TValue, TAttributes>(value: TValue, attributes?: TAttributes) => ({ value, attributes })

export { createElement }
