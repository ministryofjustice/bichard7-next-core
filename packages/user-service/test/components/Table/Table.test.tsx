import { render } from "@testing-library/react"
import { Table, TableHeaders } from "components/Table"
import KeyValuePair from "types/KeyValuePair"

const tableData: KeyValuePair<string, string>[] = [{ column1: "Column 1 value" }, { column2: "Column 2 value" }]

const tableHeaders: TableHeaders = [
  ["column1", "First Column"],
  ["column2", "Second Column"]
]

it("should render text column when no specific column type provided", () => {
  const { container } = render(<Table tableHeaders={tableHeaders} tableTitle="Testing Table" tableData={tableData} />)

  expect(container).toMatchSnapshot()
})

it("should render custom column when custom column field name exists", () => {
  const CustomColumn = ({ field }: { field: string }) => <div>{`Custom column for field ${field}`}</div>

  const { container } = render(
    <Table tableHeaders={tableHeaders} tableTitle="Testing Table" tableData={tableData}>
      <CustomColumn field="column1" />
    </Table>
  )

  expect(container).toMatchSnapshot()
})

it("should not render custom column when custom column field name does not exist", () => {
  const CustomColumn = ({ field }: { field: string }) => <div>{`Custom column for field ${field}`}</div>

  const { container } = render(
    <Table tableHeaders={tableHeaders} tableTitle="Testing Table" tableData={tableData}>
      <CustomColumn field="invalidFieldName" />
    </Table>
  )

  expect(container).toMatchSnapshot()
})
