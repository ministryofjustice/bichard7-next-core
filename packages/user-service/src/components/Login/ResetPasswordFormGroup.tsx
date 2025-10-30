import PasswordInput from "./PasswordInput"
import React from "react"

interface ResetPasswordFormGroupProps {
  passwordMismatch: boolean | undefined
  passwordsMismatchError: string
  newPasswordError: string | false | undefined
}

const ResetPasswordFormGroup = ({
  passwordMismatch,
  passwordsMismatchError,
  newPasswordError
}: ResetPasswordFormGroupProps) => {
  const formGroupClasses = `govuk-form-group ${passwordMismatch ? "govuk-form-group--error" : ""}`

  const textInputWidth = "30"

  return (
    <div className={formGroupClasses}>
      {passwordMismatch && (
        <span id={"password-mismatch-error"} className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {passwordsMismatchError}
        </span>
      )}

      <PasswordInput
        id="newPassword"
        name="newPassword"
        label="New password"
        labelSize="s"
        hint="Enter your new password"
        error={newPasswordError}
        width={textInputWidth}
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        labelSize="s"
        hint="Re-type your password"
        width={textInputWidth}
      />
    </div>
  )
}

export default ResetPasswordFormGroup
