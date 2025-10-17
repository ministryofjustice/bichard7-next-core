import axios from "axios"
import { Button } from "components/Buttons/Button"
import { Card } from "components/Card"
import { NoteTextArea } from "components/NoteTextArea"
import { MAX_NOTE_LENGTH } from "config"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useRouter } from "next/router"
import { useActionState, useState, type FormEventHandler } from "react"
import { useFormStatus } from "react-dom"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { ExceptionQualityDropdown } from "./ExceptionQualityDropdown"
import { ButtonContainer, DropdownContainer } from "./QualityStatusForm.styles"
import { TriggerQualityDropdown } from "./TriggerQualityDropdown"

const initialFormState = {
  submitError: null as Error | null,
  triggerQualityHasError: false,
  exceptionQualityHasError: false
}

type FormState = typeof initialFormState

interface Props {
  hasExceptions: boolean
  hasTriggers: boolean
}

export const QualityStatusForm = ({ hasTriggers, hasExceptions }: Props) => {
  const { csrfToken, updateCsrfToken } = useCsrfToken()
  const { courtCase, updateCourtCase } = useCourtCase()
  const router = useRouter()

  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  const qualityNotChecked = 1

  const submit = async (_: FormState, formData: FormData) => {
    const newState: FormState = {
      submitError: null,
      triggerQualityHasError: false,
      exceptionQualityHasError: false
    }

    const triggerQuality = hasTriggers ? Number(formData.get("trigger-quality")) : qualityNotChecked
    const exceptionQuality = hasExceptions ? Number(formData.get("exception-quality")) : qualityNotChecked
    const note = formData.get("quality-status-note")

    let hasErrors = false
    if (hasTriggers && triggerQuality <= 1) {
      hasErrors = true
      newState.triggerQualityHasError = true
    }
    if (hasExceptions && exceptionQuality <= 1) {
      hasErrors = true
      newState.exceptionQualityHasError = true
    }
    if (hasErrors) {
      return newState
    }

    try {
      const response = await axios.post(`${router.basePath}/api/court-cases/${courtCase.errorId}/audit`, {
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
      newState.submitError = error as Error
    }

    return newState
  }

  const [submitResult, submitAction] = useActionState(submit, initialFormState)

  return (
    <Card heading={"Set quality status"}>
      <form action={submitAction} aria-describedby={submitResult.submitError ? "quality-status-form-error" : undefined}>
        {submitResult.submitError ? (
          <p id="quality-status-form-error" className="govuk-error-message" role="alert">
            {"Audit has failed, please refresh"}
          </p>
        ) : null}
        <fieldset className="govuk-fieldset">
          <DropdownContainer>
            {hasTriggers && <TriggerQualityDropdown showError={submitResult.triggerQualityHasError} />}
            {hasExceptions && <ExceptionQualityDropdown showError={submitResult.exceptionQualityHasError} />}
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
