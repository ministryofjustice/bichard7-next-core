import { render } from "@testing-library/react"
import AccessDenied from "pages/403"
import { MockNextRouter } from "../MockNextRouter"

it("should render the component and match the snapshot", () => {
  const { container } = render(
    <MockNextRouter>
      <AccessDenied />
    </MockNextRouter>
  )

  expect(container).toMatchSnapshot()
})
