import { Tag } from "govuk-react"
import { tagBlue, textBlue } from "../../../../utils/colours"
import { LockedByTag, LockedByTextSpan } from "./LockedByText.styles"
import LockedImage from "./LockedImage"

interface LockedByTextProps {
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByText = ({ lockedBy, unlockPath }: LockedByTextProps) => {
  return (
    <Tag backgroundColor={tagBlue} color={textBlue} className={`locked-by-tag`}>
      <LockedByTag>
        <LockedImage unlockPath={unlockPath} />
        <LockedByTextSpan className={`locked-by-text`}>{lockedBy}</LockedByTextSpan>
      </LockedByTag>
    </Tag>
  )
}

export default LockedByText
