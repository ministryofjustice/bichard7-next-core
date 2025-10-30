import { render } from "@testing-library/react"
import BulletList from "components/BulletList"

describe("BulletList", () => {
  it("should render the heading and list items and match the snapshot", () => {
    const items = ["apples", "oranges", "pears"]

    const { container } = render(<BulletList heading="You can buy:" items={items} />)

    expect(container).toMatchSnapshot()
  })

  it("should render only the list items when no heading is provided", () => {
    const items = ["A", "B", "C"]

    const { container } = render(<BulletList items={items} />)

    expect(container).toMatchSnapshot()
  })

  it("should render null/nothing when the items array is empty", () => {
    const { container } = render(<BulletList heading="Empty List" items={[]} />)

    expect(container).toMatchSnapshot()
  })
})
