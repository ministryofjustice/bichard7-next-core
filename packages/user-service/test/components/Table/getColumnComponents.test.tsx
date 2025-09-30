import { getColumnComponents } from "components/Table/getColumnComponents"

const DummyElement = (props: { field: string }) => <div>{props.field}</div>

describe("getColumnComponents", () => {
  it("should return 2 properties when there are 2 elements", () => {
    const element = (
      <>
        <DummyElement field="Field1" />
        <DummyElement field="Field2" />
      </>
    )

    const result = getColumnComponents(element.props.children)

    expect(result).toBeDefined()
    expect(result).toHaveProperty("Field1")
    expect(result).toHaveProperty("Field2")
  })

  it("should return no property when there are no elements", () => {
    const element = <></>

    const result = getColumnComponents(element.props.children)

    expect(result).toBeDefined()
    expect(Object.keys(result)).toHaveLength(0)
  })
})
