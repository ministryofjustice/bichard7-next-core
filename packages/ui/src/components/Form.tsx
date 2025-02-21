import { FormEventHandler } from "react"
import { CSRF } from "../config"

interface Props {
  children: React.ReactNode
  csrfToken: string
  method: string
  action?: string
  onSubmit?: FormEventHandler<HTMLFormElement>
  className?: string
}

const Form = ({ children, csrfToken, method, action, onSubmit, className }: Props) => {
  const { tokenName } = CSRF

  return (
    <form method={method} action={action} onSubmit={onSubmit} className={className}>
      <input type="hidden" name={tokenName} value={csrfToken} />
      {children}
    </form>
  )
}

export default Form
