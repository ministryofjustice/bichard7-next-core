import { BadgeColours } from "components/Badge"

import EditableBadgeWrapper from "./EditableBadgeWrapper"

const InitialInputValueBadge = () => (
  <EditableBadgeWrapper className={"moj-badge--large"} colour={BadgeColours.Grey} label={"Initial Value"} />
)
const EditableFieldBadge = () => (
  <EditableBadgeWrapper className={"moj-badge--large"} colour={BadgeColours.Purple} label={"Editable Field"} />
)
const CorrectionBadge = () => (
  <EditableBadgeWrapper className={"moj-badge--large"} colour={BadgeColours.Green} label={"Correction"} />
)

export { CorrectionBadge, EditableFieldBadge, InitialInputValueBadge }
