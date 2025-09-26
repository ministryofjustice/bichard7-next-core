import KeyValuePair from "types/KeyValuePair"
import User from "types/User"

interface ValidationResult {
  usernameError: string | false
  forenamesError: string | false
  surnameError: string | false
  emailError: string | false
  isFormValid: boolean
}

const userFormIsValid = (
  { username, forenames, surname, emailAddress }: Partial<User> | Partial<User>,
  isEdit: boolean
): ValidationResult => {
  const validationResult = {
    forenamesError: !forenames?.trim() && "Enter the user's forename(s)",
    surnameError: !surname?.trim() && "Enter the user's surname",
    emailError:
      (!emailAddress?.trim() && "Enter the user's email address") ||
      (!!emailAddress?.match(/\.cjsm\.net$/i) && "The user's email address should not end with .cjsm.net")
  } as ValidationResult

  if (!isEdit) {
    validationResult.usernameError = !username?.trim() && "Enter a username for the new user"
  }

  validationResult.isFormValid =
    Object.keys(validationResult).filter(
      (key) => !!(validationResult as unknown as KeyValuePair<string, string | false>)[key]
    ).length === 0

  return validationResult
}

export default userFormIsValid
