import ConditionalRender from "components/ConditionalRender"
import { MAX_NOTE_LENGTH } from "config"
import { useCsrfToken } from "context/CsrfTokenContext"
import { Button, FormGroup, HintText, Label, TextArea } from "govuk-react"
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
  const csrfToken = useCsrfToken()

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
        <FormGroup>
          <Label className="govuk-heading-m b7-form-label-lg" htmlFor="note-text">
            {"Add a new note"}
          </Label>
          <TextArea
            input={{
              id: "note-text",
              name: "noteText",
              rows: 5,
              maxLength: MAX_NOTE_LENGTH,
              onInput: handleOnNoteChange
            }}
            meta={{
              error: "The note cannot be empty",
              touched: showError
            }}
          >
            {""}
          </TextArea>
          <HintText>{`You have ${noteRemainingLength} characters remaining`}</HintText>
        </FormGroup>

        <Button id="add-note-button" type="submit">
          {"Add note"}
        </Button>
      </Form>
    </ConditionalRender>
  )
}

export default AddNoteForm
