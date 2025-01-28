import { LockedByTag, LockedByTextSpan } from "./LockedByText.styles"
import LockedImage from "./LockedImage"

interface LockedByTextProps {
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByText = ({ lockedBy, unlockPath }: LockedByTextProps) => {
  return (
    <strong className={`locked-by-tag govuk-tag`}>
      <LockedByTag>
        <LockedImage unlockPath={unlockPath} />
        <LockedByTextSpan className={`locked-by-text`}>{lockedBy}</LockedByTextSpan>
      </LockedByTag>
    </strong>
  )
}

export default LockedByText
