import { LockedByTag } from "./LockedByText.styles"
import LockedImage from "./LockedImage"

interface LockedByTextProps {
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByText = ({ lockedBy, unlockPath }: LockedByTextProps) => {
  return (
    <LockedByTag className={`locked-by-tag`}>
      <LockedImage unlockPath={unlockPath} />
      <span className={`locked-by-text`}>{lockedBy}</span>
    </LockedByTag>
  )
}

export default LockedByText
