import { useState, type FormEventHandler } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { Card } from "components/Card"
import { NoteTextArea } from "components/NoteTextArea"
import { Button } from "components/Buttons/Button"
import { MAX_NOTE_LENGTH } from "config"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCourtCase } from "context/CourtCaseContext"
import { TriggerQualityDropdown } from "./TriggerQualityDropdown"
import { ExceptionQualityDropdown } from "./ExceptionQualityDropdown"
import { DropdownContainer, ButtonContainer } from "./QualityStatusCard.styles"
import { DisplayFullCourtCase } from "../../../../types/display/CourtCases"
import { useFormStatus } from "react-dom"

export const QualityStatusCard = () => {
  const { csrfToken, updateCsrfToken } = useCsrfToken()
  const { courtCase, updateCourtCase } = useCourtCase()
  const router = useRouter()

  const [submitError, setSubmitError] = useState<Error | null>(null)
  const [triggerQualityHasError, setTriggerQualityHasError] = useState(false)
  const [exceptionQualityHasError, setExceptionQualityHasError] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setSubmitError(null)
    setTriggerQualityHasError(false)
    setExceptionQualityHasError(false)

    const triggerQuality = Number(formData.get("trigger-quality"))
    const exceptionQuality = Number(formData.get("exception-quality"))
    const note = formData.get("quality-status-note")

    let hasErrors = false
    if (triggerQuality <= 1) {
      hasErrors = true
      setTriggerQualityHasError(true)
    }
    if (exceptionQuality <= 1) {
      hasErrors = true
      setExceptionQualityHasError(true)
    }

    if (!hasErrors) {
      try {
        const response = await axios.put(`${router.basePath}/bichard/api/court-cases/${courtCase.errorId}/audit`, {
          csrfToken,
          data: {
            triggerQuality,
            exceptionQuality,
            note
          }
        })

        updateCourtCase(response.data.courtCase satisfies DisplayFullCourtCase)
        updateCsrfToken(response.data.csrfToken as string)
      } catch (error) {
        setSubmitError(error as Error)
      }
    }
  }

  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  return (
    <Card heading={"Set quality status"}>
      <form action={handleSubmit} aria-describedby="quality-status-form-error">
        {submitError ? (
          <p id="quality-status-form-error" className="govuk-error-message" role="alert">
            {"Audit has failed, please refresh"}
          </p>
        ) : null}
        <fieldset className="govuk-fieldset">
          <DropdownContainer>
            <TriggerQualityDropdown
              showError={triggerQualityHasError}
              onChange={(e) => {
                if (Number(e.target.value) > 1) {
                  setTriggerQualityHasError(false)
                }
              }}
            />
            <ExceptionQualityDropdown
              showError={exceptionQualityHasError}
              onChange={(e) => {
                if (Number(e.target.value) > 1) {
                  setExceptionQualityHasError(false)
                }
              }}
            />
          </DropdownContainer>

          <NoteTextArea
            handleOnNoteChange={handleOnNoteChange}
            noteRemainingLength={noteRemainingLength}
            labelText={"Add a new note (optional)"}
            labelSize={"s"}
            name={"quality-status-note"}
          />

          <ButtonContainer>
            <SubmitButton />
          </ButtonContainer>
        </fieldset>
      </form>
    </Card>
  )
}

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button id="quality-status-submit" type="submit" disabled={pending}>
      {"Submit Audit"}
    </Button>
  )
}
