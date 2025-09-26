import { render } from "@testing-library/react"
import Form from "components/Form"

it("should render form component and its children", () => {
  const { container } = render(
    <Form method="POST" csrfToken="Dummy-CSRF-Token">
      <input type="text" />
    </Form>
  )

  expect(container).toMatchSnapshot()
})
