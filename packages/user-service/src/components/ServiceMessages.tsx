import { format } from "date-fns"
import useCustomStyles from "styles/useCustomStyles"
import ServiceMessage from "types/ServiceMessage"
import GridColumn from "./GridColumn"
import GridRow from "./GridRow"
import Paragraph from "./Paragraph"

interface Props {
  messages: ServiceMessage[]
}

const ServiceMessages = ({ messages }: Props) => {
  const classes = useCustomStyles()

  return (
    <>
      {messages.length === 0 && <Paragraph>{"There are no service messages to display."}</Paragraph>}

      {messages.map((message, index) => (
        <GridRow key={String(index)}>
          <GridColumn width="full">
            <Paragraph className={`govuk-!-font-size-16 ${classes["service-message"]}`}>
              <time
                className="govuk-!-font-weight-bold govuk-!-font-size-14"
                aria-label="time"
                title={format(new Date(message.incidentDate || message.createdAt), "dd MMMM yyyy HH:mm")}
              >
                {format(new Date(message.incidentDate || message.createdAt), "dd MMMM yyyy")}
              </time>
              <br />
              {message.message}
            </Paragraph>
          </GridColumn>
        </GridRow>
      ))}
    </>
  )
}

export default ServiceMessages
