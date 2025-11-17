import { render } from "@testing-library/react"
import Custom500 from "pages/500"
import { MockNextRouter } from "../MockNextRouter"

it("should render the component and match the snapshot", () => {
  const { container } = render(
    <MockNextRouter>
      <Custom500 />
    </MockNextRouter>
  )

  expect(container).toMatchSnapshot()
})
