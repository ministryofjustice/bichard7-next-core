import { render } from "@testing-library/react"
import ResetPasswordFormGroup from "components/Login/ResetPasswordFormGroup"

describe("ResetPasswordFormGroup", () => {
  it("should render correctly without any errors", () => {
    const { container } = render(
      <ResetPasswordFormGroup
        passwordMismatch={false}
        passwordsMismatchError={undefined}
        newPasswordError={undefined}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it("should render with group error styling and message when passwordMismatch is true", () => {
    const mismatchMessage = "Passwords do not match"
    const { container } = render(
      <ResetPasswordFormGroup
        passwordMismatch={true}
        passwordsMismatchError={mismatchMessage}
        newPasswordError={undefined}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it("should pass newPasswordError to the specific New Password input", () => {
    const individualErrorMessage = "Your password is too short"
    const { container } = render(
      <ResetPasswordFormGroup
        passwordMismatch={false}
        passwordsMismatchError={"Should not show"}
        newPasswordError={individualErrorMessage}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
