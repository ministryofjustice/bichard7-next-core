import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import Badge, { BadgeColours } from "./Badge"
import ErrorIcon from "./ErrorIcon"
import ErrorPromptMessage from "./ErrorPromptMessage"
import { Content, Label } from "./ExceptionFieldRow.styles"

type Props = {
  badgeText?: ExceptionBadgeType
  value?: string | React.ReactNode
  badgeColour?: BadgeColours
  label: string
  children?: React.ReactNode
  displayError?: boolean
  message?: string
}

const ExceptionFieldRow = ({ badgeText, badgeColour, value, label, displayError, message, children }: Props) => {
  return (
    <div className="govuk-summary-list__row">
      <Label className="govuk-summary-list__key">
        {label}
        {displayError !== false && (
          <>
            <div className="error-icon">
              <ErrorIcon />
            </div>
            {children}
          </>
        )}
      </Label>
      <Content className="govuk-summary-list__value">
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
    </div>
  )
}

export default ExceptionFieldRow
