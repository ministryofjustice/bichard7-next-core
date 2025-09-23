import { useState, type FormEventHandler } from "react"
import { useRouter } from "next/router"
import { Card } from "components/Card"
import Form from "components/Form"
import { NoteTextArea } from "components/NoteTextArea"
import { Button } from "components/Buttons/Button"
import { MAX_NOTE_LENGTH } from "config"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCourtCase } from "context/CourtCaseContext"
import { TriggerQualityDropdown } from "./TriggerQualityDropdown"
import { ExceptionQualityDropdown } from "./ExceptionQualityDropdown"
import { DropdownContainer, ButtonContainer } from "./QualityStatusCard.styles"
import axios from "axios"

export const QualityStatusCard = () => {
  const { csrfToken } = useCsrfToken()
  const { courtCase } = useCourtCase()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    axios.post(`${router.basePath}/bichard/api/court-cases/${courtCase.errorId}/audit`, {
      csrfToken,
      data: {
        triggerQuality: Number(formData.get("trigger-quality")),
        exceptionQuality: Number(formData.get("exception-quality")),
        note: formData.get("quality-status-note")
      }
    })
  }

  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  return (
    <Card heading={"Set quality status"}>
      <Form
        method="POST"
        action={`${router.basePath}/bichard/api/court-cases/${courtCase.errorId}/audit`}
        csrfToken={csrfToken || ""}
        onSubmit={handleSubmit}
      >
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
