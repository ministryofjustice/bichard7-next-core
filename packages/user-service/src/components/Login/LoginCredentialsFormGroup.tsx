import TextInput from "components/TextInput"
import PasswordInput from "./PasswordInput"

interface LoginCredentialsFormGroupProps {
  invalidCredentialsError?: string
  emailError?: string
  emailAddress?: string
  passwordError?: string
}

const LoginCredentialsFormGroup = ({
  invalidCredentialsError,
  emailError,
  emailAddress,
  passwordError
}: LoginCredentialsFormGroupProps) => {
  const hasError = !!invalidCredentialsError
  const formGroupClasses = `govuk-form-group ${hasError ? "govuk-form-group--error" : ""}`
  const width = "30"

  return (
    <div className={formGroupClasses}>
      {invalidCredentialsError && (
        <span id={"test"} className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {invalidCredentialsError}
        </span>
      )}

      <TextInput
        id="email"
        name="emailAddress"
        label="Email address"
        labelSize="s"
        hint="Enter the email address for your Bichard7 account"
        type="email"
        error={emailError}
        value={emailAddress}
        width={width}
      />

      <PasswordInput
        name="password"
        label="Password"
        labelSize="s"
        hint="Enter your password"
        error={passwordError}
        width={width}
      />
    </div>
  )
}

export default LoginCredentialsFormGroup
