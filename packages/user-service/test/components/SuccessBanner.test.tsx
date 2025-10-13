import SuccessBanner from "components/SuccessBanner"
import { render } from "@testing-library/react"

it("should render component when attributes are correctly set", () => {
  const message = "This is a success message"
  const { container } = render(<SuccessBanner>{message}</SuccessBanner>)

  expect(container).toMatchSnapshot()
})
