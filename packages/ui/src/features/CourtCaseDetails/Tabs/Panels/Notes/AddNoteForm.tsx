import { Button } from "components/Buttons/Button"
import { NoteTextArea } from "components/NoteTextArea"
import { MAX_NOTE_LENGTH } from "config"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useBeforeunload } from "hooks/useBeforeunload"
import { useRouter } from "next/router"
import { FormEvent, FormEventHandler, useState } from "react"
import { updateQueryWithoutResubmitCase } from "utils/updateQueryWithoutResubmitCase"
import Form from "../../../../../components/Form"

const AddNoteForm: React.FC = () => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const [submitted, setSubmitted] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const showError = !isFormValid && noteRemainingLength === MAX_NOTE_LENGTH
  const { csrfToken } = useCsrfToken()
  const router = useRouter()

  useBeforeunload(
    !submitted && noteRemainingLength !== MAX_NOTE_LENGTH
      ? (event: BeforeUnloadEvent) => event.preventDefault()
      : undefined
  )

  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    if (noteRemainingLength === MAX_NOTE_LENGTH) {
      setIsFormValid(false)
      event.preventDefault()
      return false
    }

    return true
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (validateForm(event)) {
      setSubmitted(true)
    }
  }

  return (
    <Form
      method="POST"
      action={updateQueryWithoutResubmitCase(router.basePath, router.asPath)}
      onSubmit={handleSubmit}
      csrfToken={csrfToken}
    >
      <NoteTextArea
        showError={showError}
        handleOnNoteChange={handleOnNoteChange}
        noteRemainingLength={noteRemainingLength}
        labelText={"Add a new note"}
        name="noteText"
      />

      <Button id="add-note-button" type="submit">
        {"Add note"}
      </Button>
    </Form>
  )
}

export default AddNoteForm
