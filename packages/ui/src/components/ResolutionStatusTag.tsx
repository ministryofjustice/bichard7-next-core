import { useCourtCase } from "context/CourtCaseContext"
import Image from "next/image"
import { StyledComponentPropsWithRef } from "styled-components"

import { ResolutionStatus } from "../types/ResolutionStatus"
import { TICK_ICON_URL } from "../utils/icons"
import { ResolutionStatusTagContainer } from "./ResolutionStatusTag.styles"

interface StatusTagProps extends StyledComponentPropsWithRef<typeof ResolutionStatusTagContainer> {
  itemName: string
  resolutionStatus: ResolutionStatus
}

const ResolutionStatusTag = ({ itemName, resolutionStatus, ...rest }: StatusTagProps) => {
  const { courtCase } = useCourtCase()

  let resolutionMessage
  if (itemName === "Triggers") {
    resolutionMessage = resolutionStatus
  } else {
    resolutionMessage =
      courtCase.aho.Exceptions.length > 0 && resolutionStatus === "Resolved"
        ? `Manually ${resolutionStatus}`
        : resolutionStatus
  }

  return (
    <ResolutionStatusTagContainer
      {...rest}
      className={`${itemName.toLowerCase()}-${resolutionStatus.toLowerCase()}-tag`}
    >
      {itemName}
      <Image alt="Check icon" height={18} src={TICK_ICON_URL} width={18} />
      {resolutionMessage}
    </ResolutionStatusTagContainer>
  )
}

export default ResolutionStatusTag
