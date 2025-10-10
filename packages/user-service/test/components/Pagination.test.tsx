import { render } from "@testing-library/react"
import Pagination from "components/Pagination"

it("should render the component and match the snapshot when total items is more than zero", () => {
  const { container } = render(<Pagination href="/dummy-url" maxItemsPerPage={10} pageNumber={1} totalItems={100} />)

  expect(container).toMatchSnapshot()
})

it("should render the component and match the snapshot when total items is zero", () => {
  const { container } = render(<Pagination href="/dummy-url" maxItemsPerPage={10} pageNumber={1} totalItems={0} />)

  expect(container).toMatchSnapshot()
})
