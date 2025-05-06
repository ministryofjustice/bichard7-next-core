import ButtonsGroup from "components/ButtonsGroup"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useState } from "react"
import Form from "../../../../components/Form"
import { StyledLockedByButton } from "./LockedByButton.styles"
import LockedImage from "./LockedImage"

interface UnlockConfirmationProps {
  onCancel: () => void
  unlockPath?: string
}

const UnlockConfirmation = ({ onCancel, unlockPath }: UnlockConfirmationProps) => {
  const { csrfToken } = useCsrfToken()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <>
      <p>{"Click the button to unlock the case"}</p>
      <Form method="post" action={unlockPath} csrfToken={csrfToken} onSubmit={handleSubmit}>
        <ButtonsGroup noGap={true}>
          <button className="govuk-button" data-module="govuk-button" id="unlock" disabled={isSubmitting}>
            {"Unlock"}
          </button>
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
        </ButtonsGroup>
      </Form>
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
        className={`govuk-button locked-by-tag button--tag`}
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
