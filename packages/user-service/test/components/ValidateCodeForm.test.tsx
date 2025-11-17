import { render } from "@testing-library/react"
import ValidateCodeForm from "components/Login/ValidateCodeForm"

describe("ValidateCodeForm", () => {
  const commonProps = {
    csrfToken: "mock-csrf-token",
    emailAddress: "bichard01@example.com",
    validationCode: "123456",
    validationCodeError: undefined,
    stageValue: "validateCode" as const,
    sendAgainUrl: "/send-code-again"
  }

  it("should render correctly for 'resetStage' (Next button) with no error", () => {
    const props = {
      ...commonProps,
      stageName: "resetStage" as const
    }
    const { container } = render(<ValidateCodeForm {...props} />)

    expect(container).toMatchSnapshot()
  })

  it("should render correctly for 'loginStage' (Sign in button) and show RememberForm", () => {
    const props = {
      ...commonProps,
      stageName: "loginStage" as const,
      showRememberForm: true
    }
    const { container } = render(<ValidateCodeForm {...props} />)

    expect(container).toMatchSnapshot()
  })

  it("should render correctly when a validationCodeError is present", () => {
    const props = {
      ...commonProps,
      stageName: "resetStage" as const,
      validationCodeError: "Incorrect security code"
    }
    const { container } = render(<ValidateCodeForm {...props} />)

    expect(container).toMatchSnapshot()
  })

  it("should render with custom button text if provided", () => {
    const props = {
      ...commonProps,
      stageName: "resetStage" as const,
      buttonText: "Verify Code"
    }
    const { container } = render(<ValidateCodeForm {...props} />)

    expect(container).toMatchSnapshot()
  })
})
