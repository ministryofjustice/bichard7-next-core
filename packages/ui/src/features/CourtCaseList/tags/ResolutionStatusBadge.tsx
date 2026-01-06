import type { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import Badge, { BadgeColours } from "components/Badge"

interface Props {
  resolutionStatus: ResolutionStatus
}

const ResolutionStatusBadge: React.FC<Props> = ({ resolutionStatus }: Props) => (
  <>
    {resolutionStatus !== "Unresolved" && (
      <Badge
        isRendered={true}
        label={resolutionStatus}
        colour={resolutionStatus === "Resolved" ? BadgeColours.Grey : BadgeColours.Blue}
        className={`govuk-!-static-margin-left-5 moj-badge-${resolutionStatus.toLowerCase()} moj-badge--large`}
      />
    )}
  </>
)

export default ResolutionStatusBadge
