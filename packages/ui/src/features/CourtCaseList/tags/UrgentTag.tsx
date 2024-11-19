import Badge, { BadgeColours } from "components/Badge"

const UrgentTag: React.FC<{ isUrgent: boolean }> = (props: { isUrgent: boolean }) => (
  <Badge
    className="govuk-!-static-margin-left-5 moj-badge--large"
    colour={BadgeColours.Red}
    isRendered={props.isUrgent}
    label="Urgent"
  />
)

export default UrgentTag
