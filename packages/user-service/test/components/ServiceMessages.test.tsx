import { render } from "@testing-library/react"
import ServiceMessages from "components/ServiceMessages"
import ServiceMessage from "types/ServiceMessage"

it("should render the component and match the snapshot when there are messages", () => {
  const messages: ServiceMessage[] = [
    { id: 1, message: "Message 1", createdAt: new Date("2021-09-28T10:12:13") },
    { id: 2, message: "Message 2", createdAt: new Date("2021-09-29T11:14:17") },
    {
      id: 3,
      message: "Message 3",
      createdAt: new Date("2021-09-30T17:45:23"),
      incidentDate: new Date("2021-10-10T16:30:00")
    }
  ]
  const { container } = render(<ServiceMessages messages={messages} />)

  expect(container).toMatchSnapshot()
})

it("should render the component and match the snapshot when there are no messages", () => {
  const { container } = render(<ServiceMessages messages={[]} />)

  expect(container).toMatchSnapshot()
})
