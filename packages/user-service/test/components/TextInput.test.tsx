import { render } from "@testing-library/react"
import TextInput from "components/TextInput"

it("should render text input component", () => {
  const { container } = render(
    <TextInput
      id="inputId"
      name="inputName"
      readOnly
      disabled
      value="Input Value"
      error="Error message"
      label="Input label"
      labelSize="s"
      className="custom-class-name"
      mandatory
      type="email"
      hint="Input hint"
      width="5"
    />
  )

  expect(container).toMatchSnapshot()
})
