import { render } from "@testing-library/react"
import { TextAreaWithCharCount } from "components/TextAreaWithCharCount"

it("should render text area with character count component", () => {
  const { container } = render(
    <TextAreaWithCharCount
      value="This is a test"
      id="testRadio"
      name="testRadio"
      hint="Test hint"
      label="Test label"
      charLimit={25}
      isEmpty={false}
      isOverCharLimit={false}
      charLimitErrorMessage="Too many characters"
      emptyErrorMessage="Empty text area"
    />
  )
  expect(container).toMatchSnapshot()
})
