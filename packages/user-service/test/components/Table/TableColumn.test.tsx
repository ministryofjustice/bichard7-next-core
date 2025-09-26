import TableColumn from "components/Table/TableColumn"
import { render } from "@testing-library/react"
import { ReactNode } from "react"
import KeyValuePair from "types/KeyValuePair"

it("should render the field value when custom column component is not provided", () => {
  const item = { dummyField: "DummyValue" }

  const WrapperComponent = ({ children }: { children: ReactNode }) => (
    <table>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  )
  const { container } = render(<TableColumn field="dummyField" item={item} />, {
    wrapper: WrapperComponent as React.ComponentType
  })

  expect(container).toMatchSnapshot()
})

it("should render the component when custom column component is provided", () => {
  const dummyItem = { dummyField: "DummyValue" }

  type ColumnComponentProps = { item?: KeyValuePair<string, string>; field: string }
  type WrapperProps = { children: ReactNode }

  const ColumnComponent = ({ item, field }: ColumnComponentProps) => <h1>{item?.[field]}</h1>

  const WrapperComponent = ({ children }: WrapperProps) => (
    <table>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  )
  const { container } = render(
    <TableColumn field="dummyField" item={dummyItem} component={<ColumnComponent field="dummyField" />} />,
    {
      wrapper: WrapperComponent as React.ComponentType
    }
  )

  expect(container).toMatchSnapshot()
})
