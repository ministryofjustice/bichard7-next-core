import { render } from "@testing-library/react"
import { ErrorSummary } from "components/ErrorSummary"

it("should render error summary component", () => {
  const { container } = render(
    <ErrorSummary>
      <p>{"Error summary body"}</p>
    </ErrorSummary>
  )

  expect(container).toMatchSnapshot()
})
