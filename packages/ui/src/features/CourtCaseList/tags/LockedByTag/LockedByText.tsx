import { Tag } from "govuk-react"

import { tagBlue, textBlue } from "../../../../utils/colours"
import { LockedByTag, LockedByTextSpan } from "./LockedByText.styles"
import LockedImage from "./LockedImage"

interface LockedByTextProps {
  lockedBy?: null | string
  unlockPath?: string
}

const LockedByText = ({ lockedBy, unlockPath }: LockedByTextProps) => {
  return (
    <Tag backgroundColor={tagBlue} className={`locked-by-tag`} color={textBlue}>
      <LockedByTag>
        <LockedImage unlockPath={unlockPath} />
        <LockedByTextSpan className={`locked-by-text`}>{lockedBy}</LockedByTextSpan>
      </LockedByTag>
    </Tag>
  )
}

export default LockedByText
