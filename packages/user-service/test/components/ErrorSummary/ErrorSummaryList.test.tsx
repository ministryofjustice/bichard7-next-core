import { render } from "@testing-library/react"
import { ErrorSummaryList } from "components/ErrorSummary"

it("should render error summary list component", () => {
  const { container } = render(
    <ErrorSummaryList
      items={[
        { id: "field1", error: "Error 1" },
        { id: "field2", error: false },
        { id: "field2", error: "" }
      ]}
    />
  )

  expect(container).toMatchSnapshot()
})
