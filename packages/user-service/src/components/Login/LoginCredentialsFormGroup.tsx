import TextInput from "components/TextInput"

interface LoginCredentialsFormGroupProps {
  invalidCredentialsError?: string
  emailError?: string
  emailAddress?: string
}

const LoginCredentialsFormGroup = ({
  invalidCredentialsError,
  emailError,
  emailAddress
}: LoginCredentialsFormGroupProps) => {
  const hasError = !!invalidCredentialsError
  const formGroupClasses = `govuk-form-group ${hasError ? "govuk-form-group--error" : ""}`

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
      />
      <TextInput name="password" label="Password" labelSize="s" type="password" hint="Enter your password" />
    </div>
  )
}

export default LoginCredentialsFormGroup
