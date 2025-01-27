import { Button } from "components/Buttons"
import ConditionalRender from "components/ConditionalRender"
import { NoteTextArea } from "components/NoteTextArea"
import { MAX_NOTE_LENGTH } from "config"
import { useCsrfToken } from "context/CsrfTokenContext"
import { FormEvent, FormEventHandler, useState } from "react"
import { useBeforeunload } from "react-beforeunload"
import Form from "../../../../../components/Form"

interface Props {
  isLockedByCurrentUser: boolean
}

const AddNoteForm: React.FC<Props> = ({ isLockedByCurrentUser }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const [submitted, setSubmitted] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const showError = !isFormValid && noteRemainingLength === MAX_NOTE_LENGTH
  const { csrfToken } = useCsrfToken()

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
    <ConditionalRender isRendered={isLockedByCurrentUser}>
      <Form method="POST" action="" onSubmit={handleSubmit} csrfToken={csrfToken}>
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
    </ConditionalRender>
  )
}

export default AddNoteForm
