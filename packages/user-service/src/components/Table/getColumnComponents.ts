import type { ReactNode, ReactPortal } from "react"
import { Children } from "react"
import type KeyValuePair from "types/KeyValuePair"

export default (children: ReactNode): KeyValuePair<string, JSX.Element> => {
  const result: KeyValuePair<string, JSX.Element> = {}

  Children.toArray(children).forEach((child) => {
    const key = String((child as ReactPortal).props.field)
    result[key] = child as JSX.Element
  })

  return result
}
