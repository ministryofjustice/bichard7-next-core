import type { ReactNode, ReactPortal, JSX } from "react"
import { Children } from "react"
import type KeyValuePair from "types/KeyValuePair"

export default (children: ReactNode): KeyValuePair<string, JSX.Element> => {
  const result: KeyValuePair<string, JSX.Element> = {}

  Children.toArray(children).forEach((child) => {
    // @ts-expect-error -- Type of props is unknown
    const key = String((child as ReactPortal).props.field)
    result[key] = child as JSX.Element
  })

  return result
}
