import Image from "next/image"
import { StyledComponentPropsWithRef } from "styled-components"

import { LOCKED_ICON_URL } from "../utils/icons"
import { LockedTagContainer, Lockee } from "./LockedTag.styles"

interface LockedTagProps extends StyledComponentPropsWithRef<typeof LockedTagContainer> {
  lockedBy: string
  lockName: string
}

const LockedTag = ({ lockedBy, lockName, ...rest }: LockedTagProps) => (
  <LockedTagContainer {...rest} className={`${lockName.toLowerCase()}-locked-tag`}>
    <span className="govuk-body">
      <b>{lockName}</b>
    </span>
    <Lockee id={`${lockName.toLowerCase()}-locked-tag-lockee`}>
      <Image alt="Lock icon" height={18} src={LOCKED_ICON_URL} width={18} />
      <span className="govuk-body">{lockedBy}</span>
    </Lockee>
  </LockedTagContainer>
)

export default LockedTag
