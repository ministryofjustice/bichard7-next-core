import React, { ComponentProps } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "../../components/Buttons/Button"

type FormSubmitButtonProps = ComponentProps<typeof Button>

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ disabled, ...props }) => {
  const formStatus = useFormStatus()

  return <Button {...props} type="submit" disabled={disabled || formStatus.pending} />
}

export default FormSubmitButton
