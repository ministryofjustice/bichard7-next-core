import { render } from "@testing-library/react"
import { Summary, SummaryItem } from "components/Summary"

it("should render summary component and its items", () => {
  const { container } = render(
    <Summary>
      <SummaryItem label="Label name 1" value="Label value 1" dataTest={"summary-item-1"} />
      <SummaryItem label="Label name 2" value="Label value 2" dataTest={"summary-item-2"} />
      <SummaryItem label="Label name 3" value="Label value 3" dataTest={"summary-item-3"} />
    </Summary>
  )

  expect(container).toMatchSnapshot()
})
