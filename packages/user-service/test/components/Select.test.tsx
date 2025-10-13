import { render } from "@testing-library/react"
import Select, { Option } from "components/Select"

it("should render select component correctly", () => {
  const options: Option[] = [
    {
      id: "test-id-01",
      name: "test-name-01"
    },
    {
      id: "test-id-02",
      name: "test-name-02"
    },
    {
      id: "test-id-03",
      name: "test-name-03"
    }
  ]

  const { container } = render(<Select options={options} label="test-select-label" id="test-id" />)

  expect(container).toMatchSnapshot()
})
