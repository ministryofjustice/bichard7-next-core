import React, { ComponentProps } from "react"
import { Button } from "../../components/Buttons/Button"
import { useFormStatus } from "react-dom"

type AuditSearchSubmitButtonProps = ComponentProps<typeof Button> & { formValid: boolean }

const AuditSearchSubmitButton: React.FC<AuditSearchSubmitButtonProps> = ({ formValid, disabled, ...props }) => {
  const formStatus = useFormStatus()
  return (
    <Button
      {...props}
      name="audit-search-button"
      type="submit"
      disabled={disabled || !formValid || formStatus.pending}
    />
  )
}

export default AuditSearchSubmitButton
