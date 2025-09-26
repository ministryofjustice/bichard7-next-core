/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render } from "@testing-library/react"
import { SummaryItem } from "components/Summary"

it("should render component", () => {
  const { container } = render(<SummaryItem label="Label name" value="Label value" />)

  expect(container).toMatchSnapshot()
})
