import { fireEvent, render, screen } from "@testing-library/react"
import PasswordInput from "components/Login/PasswordInput"

describe("PasswordInput", () => {
  it("should render correctly with required props (label and name)", () => {
    const { container } = render(<PasswordInput label="Test Label" name="testPassword" />)
    expect(container).toMatchSnapshot()
  })

  it("should render with error styling and an error message when 'error' is a string", () => {
    const { container } = render(
      <PasswordInput label="Password" name="testPassword" error="You must enter a stronger password" />
    )
    expect(container).toMatchSnapshot()
  })

  it("should render with a hint, a specific width class, and no error", () => {
    const { container } = render(<PasswordInput label="Secret Code" name="secretCode" hint="Keep it safe" width="10" />)
    expect(container).toMatchSnapshot()
  })

  it("should render with a large label size class", () => {
    const { container } = render(<PasswordInput label="Large Label" name="largeLabelPass" labelSize="l" />)
    expect(container).toMatchSnapshot()
  })
})

it("should toggle password visibility when button is clicked", () => {
  render(<PasswordInput label="password" name="test" />)
  const input = screen.getByTestId("password-input_test")
  const button = screen.getByTestId("password-input-button_test")

  expect(input.getAttribute("type")).toBe("password")
  expect(button.textContent).toBe("Show")
  expect(button.getAttribute("aria-label")).toBe("Show password")

  fireEvent.click(button)
  expect(input.getAttribute("type")).toBe("text")
  expect(button.textContent).toBe("Hide")
  expect(button.getAttribute("aria-label")).toBe("Hide password")

  fireEvent.click(button)
  expect(input.getAttribute("type")).toBe("password")
  expect(button.textContent).toBe("Show")
  expect(button.getAttribute("aria-label")).toBe("Show password")
})
