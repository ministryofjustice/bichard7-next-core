import type { ReactEventHandler } from "react"
import { ActionLinkButton } from "./ActionLink.styles"

interface Props extends React.ComponentProps<"a"> {
  children: React.ReactNode
  className?: string
  onClick?: ReactEventHandler
  id?: string
}

const ActionLink = ({ children, className, onClick, id }: Props) => {
  return (
    <ActionLinkButton id={id} onClick={onClick} className={`govuk-link ${className} moj-action-link`}>
      {children}
    </ActionLinkButton>
  )
}

export default ActionLink
