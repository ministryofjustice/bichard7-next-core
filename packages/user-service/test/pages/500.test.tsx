import { render } from "@testing-library/react"
import Custom500 from "pages/500"

it("should render the component and match the snapshot", () => {
  const { container } = render(<Custom500 />)

  expect(container).toMatchSnapshot()
})
