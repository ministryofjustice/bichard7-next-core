import type { ReactEventHandler } from "react"
import { ActionLinkButton } from "./ActionLink.styles"

interface Props extends React.ComponentProps<"a"> {
  children: React.ReactNode
  className?: string
  onClick?: ReactEventHandler
}

const ActionLink = ({ children, className, onClick }: Props) => {
  return (
    <ActionLinkButton onClick={onClick} className={`${className} moj-action-link`}>
      {children}
    </ActionLinkButton>
  )
}

export default ActionLink
