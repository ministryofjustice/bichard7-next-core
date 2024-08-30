import { BadgeColours } from "components/Badge"
import EditableBadgeWrapper from "./EditableBadgeWrapper"

const InitialInputValueBadge = () => (
  <EditableBadgeWrapper colour={BadgeColours.Grey} label={"Initial Value"} className={"moj-badge--large"} />
)
const EditableFieldBadge = () => (
  <EditableBadgeWrapper colour={BadgeColours.Purple} label={"Editable Field"} className={"moj-badge--large"} />
)
const CorrectionBadge = () => (
  <EditableBadgeWrapper colour={BadgeColours.Green} label={"Correction"} className={"moj-badge--large"} />
)

export { CorrectionBadge, EditableFieldBadge, InitialInputValueBadge }
