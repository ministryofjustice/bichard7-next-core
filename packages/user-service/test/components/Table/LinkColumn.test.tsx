/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LinkColumn } from "components/Table"
import { render } from "@testing-library/react"

type Item = { url: string }
const dummyItem: Item = { url: "http://DummyURL" }

it("should render component when attributes are correctly set", () => {
  const { container } = render(<LinkColumn field="url" item={dummyItem} href={(item) => (item as Item).url} />)

  expect(container).toMatchSnapshot()
})

it("should throw error when item is not set", () => {
  const { container } = render(<LinkColumn field="dummyField" href={(item) => (item as Item).url} />)

  expect(container).toMatchSnapshot()
})
