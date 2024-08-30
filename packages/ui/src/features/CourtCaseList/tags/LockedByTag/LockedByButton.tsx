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
        <Form method="post" action={unlockPath} csrfToken={csrfToken}>
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
  lockedBy?: string | null
  unlockPath?: string
  showUnlockConfirmation: boolean
  setShowUnlockConfirmation: (value: boolean) => void
}

const LockedByButton = ({
  lockedBy,
  unlockPath,
  showUnlockConfirmation,
  setShowUnlockConfirmation
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
