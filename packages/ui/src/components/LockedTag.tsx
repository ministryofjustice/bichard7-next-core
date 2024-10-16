import Image from "next/image"
import { StyledComponentPropsWithRef } from "styled-components"
import { LOCKED_ICON_URL } from "../utils/icons"
import { LockedTagContainer, Lockee } from "./LockedTag.styles"

interface LockedTagProps extends StyledComponentPropsWithRef<typeof LockedTagContainer> {
  lockName: string
  lockedBy: string
}

const LockedTag = ({ lockName, lockedBy, ...rest }: LockedTagProps) => (
  <LockedTagContainer {...rest} className={`${lockName.toLowerCase()}-locked-tag`}>
    <span className="govuk-body">
      <b>{lockName}</b>
    </span>
    <Lockee id={`${lockName.toLowerCase()}-locked-tag-lockee`}>
      <Image src={LOCKED_ICON_URL} width={18} height={18} alt="Lock icon" />
      <span className="govuk-body">{lockedBy}</span>
    </Lockee>
  </LockedTagContainer>
)

export default LockedTag
