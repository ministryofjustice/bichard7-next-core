import Badge, { BadgeColours } from "components/Badge"

import { ResolutionStatus } from "../../../types/ResolutionStatus"

interface Props {
  resolutionStatus: ResolutionStatus
}

const ResolutionStatusBadge: React.FC<Props> = ({ resolutionStatus }: Props) => (
  <>
    {resolutionStatus !== "Unresolved" && (
      <Badge
        className={`govuk-!-static-margin-left-5 moj-badge-${resolutionStatus.toLowerCase()} moj-badge--large`}
        colour={resolutionStatus === "Resolved" ? BadgeColours.Grey : BadgeColours.Blue}
        isRendered={true}
        label={resolutionStatus}
      />
    )}
  </>
)

export default ResolutionStatusBadge
