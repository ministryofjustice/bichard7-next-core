import { useCsrfToken } from "context/CsrfTokenContext"

import Form from "../../../../components/Form"
import { StyledLockedByButton } from "./LockedByButton.styles"
import LockedImage from "./LockedImage"

interface UnlockConfirmationProps {
  onCancel: () => void
  unlockPath?: string
}

const UnlockConfirmation = ({ onCancel, unlockPath }: UnlockConfirmationProps) => {
  const csrfToken = useCsrfToken()

  return (
    <>
      <p>{"Click the button to unlock the case"}</p>
      <div className="govuk-button-group">
        <Form action={unlockPath} csrfToken={csrfToken} method="post">
          <button className="govuk-button" data-module="govuk-button" id="unlock">
            {"Unlock"}
          </button>
        </Form>
        <a
          className="govuk-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            onCancel()
          }}
        >
          {"Cancel"}
        </a>
      </div>
    </>
  )
}

interface LockedByButtonProps {
  lockedBy?: null | string
  setShowUnlockConfirmation: (value: boolean) => void
  showUnlockConfirmation: boolean
  unlockPath?: string
}

const LockedByButton = ({
  lockedBy,
  setShowUnlockConfirmation,
  showUnlockConfirmation,
  unlockPath
}: LockedByButtonProps) => {
  return (
    <>
      <StyledLockedByButton
        className={`locked-by-tag button--tag`}
        onClick={() => {
          setShowUnlockConfirmation(true)
        }}
      >
        <LockedImage unlockPath={unlockPath} />
        {lockedBy}
      </StyledLockedByButton>
      {showUnlockConfirmation && (
        <UnlockConfirmation
          onCancel={() => {
            setShowUnlockConfirmation(false)
          }}
          unlockPath={unlockPath}
        />
      )}
    </>
  )
}

export default LockedByButton
