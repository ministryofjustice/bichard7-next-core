import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  isRendered: boolean
}

const ConditionalRender = ({ children, isRendered }: Props) => {
  if (isRendered) {
    return <>{children}</>
  }

  return null
}

export default ConditionalRender
