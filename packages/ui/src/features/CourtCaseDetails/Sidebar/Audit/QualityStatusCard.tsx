import { useState, type FormEventHandler } from "react"
import { Card } from "components/Card"
import Form from "components/Form"
import { NoteTextArea } from "components/NoteTextArea"
import { Button } from "components/Buttons/Button"
import { MAX_NOTE_LENGTH } from "config"
import { useCsrfToken } from "context/CsrfTokenContext"
import { TriggerQualityDropdown } from "./TriggerQualityDropdown"
import { ExceptionQualityDropdown } from "./ExceptionQualityDropdown"
import { DropdownContainer, ButtonContainer } from "./QualityStatusCard.styles"

export const QualityStatusCard = () => {
  const { csrfToken } = useCsrfToken()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  return (
    <Card heading={"Set quality status"}>
      <Form method="POST" action="#" csrfToken={csrfToken || ""} onSubmit={handleSubmit}>
        <fieldset className="govuk-fieldset">
          <DropdownContainer>
            <TriggerQualityDropdown />
            <ExceptionQualityDropdown />
          </DropdownContainer>

          <NoteTextArea
            handleOnNoteChange={handleOnNoteChange}
            noteRemainingLength={noteRemainingLength}
            labelText={"Add a new note (optional)"}
            labelSize={"s"}
            name={"quality-status-note"}
          />

          <ButtonContainer>
            <Button id="quality-status-submit" type="submit" disabled={isSubmitting}>
              {"Submit Audit"}
            </Button>
          </ButtonContainer>
        </fieldset>
      </Form>
    </Card>
  )
}
