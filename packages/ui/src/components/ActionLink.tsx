import type { ReactEventHandler } from "react"

import { ActionLinkButton } from "./ActionLink.styles"

interface Props extends React.ComponentProps<"a"> {
  children: React.ReactNode
  className?: string
  onClick?: ReactEventHandler
}

const ActionLink = ({ children, className, onClick }: Props) => {
  return (
    <ActionLinkButton className={`${className} moj-action-link`} onClick={onClick}>
      {children}
    </ActionLinkButton>
  )
}

export default ActionLink
