import { render } from "@testing-library/react"
import ResendSecurityCodeForm from "components/Login/ResendSecurityCodeForm"

describe("ResendSecurityCodeForm", () => {
  const commonProps = {
    csrfToken: "mock-csrf-token",
    emailAddress: "bichard01@example.com",
    stageValue: "resetSecurityCode" as const
  }

  it("should render correctly for 'loginStage'", () => {
    const props = {
      ...commonProps,
      stageName: "loginStage" as const
    }
    const { container } = render(<ResendSecurityCodeForm {...props} />)

    expect(container).toMatchSnapshot()
  })

  it("should render correctly for 'resetStage'", () => {
    const props = {
      ...commonProps,
      stageName: "resetStage" as const
    }
    const { container } = render(<ResendSecurityCodeForm {...props} />)

    expect(container).toMatchSnapshot()
  })
})
