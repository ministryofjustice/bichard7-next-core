import { render } from "@testing-library/react"
import { TextAreaWithCharCount } from "components/TextAreaWithCharCount"

it("should render text area with character count component", () => {
  const { container } = render(
    <TextAreaWithCharCount
      value="This is a test"
      id="testTextAreaWithCharCount"
      name="testTextAreaWithCharCount"
      hint="Test hint"
      label="Test label"
      charLimit={25}
      hasError={false}
      errorMessage="Test error"
    />
  )
  expect(container).toMatchSnapshot()
})
