import Image from "next/image"
import { LOCKED_ICON_URL } from "../utils/icons"
import { LockedTagContainer, Lockee } from "./LockedTag.styles"

interface LockedTagProps {
  lockName: string
  lockedBy: string
}

const LockedTag = ({ lockName, lockedBy, ...rest }: LockedTagProps) => (
  <LockedTagContainer {...rest} className={`${lockName.toLowerCase()}-locked-tag`}>
    <span>
      <b>{lockName}</b>
    </span>
    <Lockee id={`${lockName.toLowerCase()}-locked-tag-lockee`}>
      <Image src={LOCKED_ICON_URL} width={18} height={18} alt="Lock icon" />
      <span>{lockedBy}</span>
    </Lockee>
  </LockedTagContainer>
)

export default LockedTag
