/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render } from "@testing-library/react"
import { Fieldset, FieldsetHint, FieldsetLegend } from "components/Fieldset"

it("should render fieldset component and its components", () => {
  const { container } = render(
    <Fieldset>
      <FieldsetLegend>{"This is fieldset legend"}</FieldsetLegend>
      <FieldsetHint>{"This is fieldset hint"}</FieldsetHint>
      <p>{"Dummy text"}</p>
    </Fieldset>
  )

  expect(container).toMatchSnapshot()
})
