import ConditionalRender from "components/ConditionalRender"
import { useState } from "react"

import LockedByButton from "./LockedByButton"
import LockedByText from "./LockedByText"

interface LockedByTagProps {
  lockedBy?: null | string
  unlockPath?: string
}

const LockedByTag = ({ lockedBy, unlockPath }: LockedByTagProps) => {
  const [showUnlockConfirmation, setShowUnlockConfirmation] = useState(false)

  return (
    <ConditionalRender isRendered={!!lockedBy}>
      {unlockPath ? (
        <LockedByButton
          lockedBy={lockedBy}
          setShowUnlockConfirmation={setShowUnlockConfirmation}
          showUnlockConfirmation={showUnlockConfirmation}
          unlockPath={unlockPath}
        />
      ) : (
        <LockedByText lockedBy={lockedBy} unlockPath={unlockPath} />
      )}
    </ConditionalRender>
  )
}

export default LockedByTag
