import { render } from "@testing-library/react"
import AccessDenied from "pages/403"

it("should render the component and match the snapshot", () => {
  const { container } = render(<AccessDenied />)

  expect(container).toMatchSnapshot()
})
