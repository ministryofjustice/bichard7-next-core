import { render } from "@testing-library/react"
import BackLink from "components/BackLink"

it("should render summary component and its items", () => {
  const { container } = render(<BackLink href="/dummy-path-1/dummy-path-2" />)

  expect(container).toMatchSnapshot()
})
