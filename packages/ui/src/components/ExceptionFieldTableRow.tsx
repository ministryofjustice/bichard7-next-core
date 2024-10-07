import { Table } from "govuk-react"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import Badge, { BadgeColours } from "./Badge"
import ErrorIcon from "./ErrorIcon"
import ErrorPromptMessage from "./ErrorPromptMessage"
import { Content, Label } from "./ExceptionFieldTableRow.styles"

type Props = {
  badgeText?: ExceptionBadgeType
  value?: string | React.ReactNode
  badgeColour?: BadgeColours
  label: string
  children?: React.ReactNode
  displayError?: boolean
  message?: string
}

const ExceptionFieldTableRow = ({ badgeText, badgeColour, value, label, displayError, message, children }: Props) => {
  return (
    <Table.Row>
      <Label>
        <b>{label}</b>
        {displayError !== false && (
          <>
            <div className="error-icon">
              <ErrorIcon />
            </div>
            {children}
          </>
        )}
      </Label>
      <Content>
        {value && <div className="field-value">{value}</div>}
        {badgeText && displayError !== false && (
          <div className="badge-wrapper">
            <Badge
              className="error-badge moj-badge--large"
              isRendered={true}
              colour={badgeColour ?? BadgeColours.Purple}
              label={badgeText}
            />
          </div>
        )}
        {message && <ErrorPromptMessage message={message} />}
      </Content>
    </Table.Row>
  )
}

export default ExceptionFieldTableRow
