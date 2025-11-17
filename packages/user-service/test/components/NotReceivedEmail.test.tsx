import { render } from "@testing-library/react"
import NotReceivedEmail from "components/NotReceivedEmail"

it("should render the component and match the snapshot", () => {
  const { container } = render(<NotReceivedEmail sendAgainUrl="http://localhost/send-again-url" />)

  expect(container).toMatchSnapshot()
})
