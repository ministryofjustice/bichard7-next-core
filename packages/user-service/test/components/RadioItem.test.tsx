import { render } from "@testing-library/react"
import { RadioItem } from "components/RadioItem"

it("should render radioItem component", () => {
  const { container } = render(
    <RadioItem value="test" id="testRadio" name="testRadio" text="This is a test" defaultChecked={true} />
  )
  expect(container).toMatchSnapshot()
})
