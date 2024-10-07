import Badge, { BadgeColours } from "components/Badge"

const UrgentTag: React.FC<{ isUrgent: boolean }> = (props: { isUrgent: boolean }) => (
  <Badge
    isRendered={props.isUrgent}
    colour={BadgeColours.Red}
    label="Urgent"
    className="govuk-!-static-margin-left-5 moj-badge--large"
  />
)

export default UrgentTag
