import { Table } from "govuk-react"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"

import Badge, { BadgeColours } from "./Badge"
import ErrorIcon from "./ErrorIcon"
import ErrorPromptMessage from "./ErrorPromptMessage"
import { Content, Label } from "./ExceptionFieldTableRow.styles"

type Props = {
  badgeColour?: BadgeColours
  badgeText?: ExceptionBadgeType
  children?: React.ReactNode
  displayError?: boolean
  label: string
  message?: string
  value?: React.ReactNode | string
}

const ExceptionFieldTableRow = ({ badgeColour, badgeText, children, displayError, label, message, value }: Props) => {
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
              colour={badgeColour ?? BadgeColours.Purple}
              isRendered={true}
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
