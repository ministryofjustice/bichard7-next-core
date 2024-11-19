import { FormEventHandler, ReactNode } from "react"

import { CSRF } from "../config"

interface Props {
  action?: string
  children: ReactNode
  className?: string
  csrfToken: string
  method: string
  onSubmit?: FormEventHandler<HTMLFormElement>
}

const Form = ({ action, children, className, csrfToken, method, onSubmit }: Props) => {
  const { tokenName } = CSRF

  return (
    <form action={action} className={className} method={method} onSubmit={onSubmit}>
      <input name={tokenName} type="hidden" value={csrfToken} />
      {children}
    </form>
  )
}

export default Form
