import axios from "axios"
import { Button } from "components/Buttons/Button"
import { Card } from "components/Card"
import { NoteTextArea } from "components/NoteTextArea"
import { MAX_NOTE_LENGTH } from "config"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useRouter } from "next/router"
import { useActionState, useState, type FormEvent } from "react"
import { useFormStatus } from "react-dom"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { ExceptionQualityDropdown } from "./ExceptionQualityDropdown"
import { ButtonContainer, DropdownContainer } from "./QualityStatusForm.styles"
import { TriggerQualityDropdown } from "./TriggerQualityDropdown"
import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"

const initialFormState = {
  errorMessage: null as string | null,
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

  const triggerQualityAlreadySet = (courtCase.triggerQualityChecked ?? 0) > 1
  const exceptionQualityAlreadySet = (courtCase.errorQualityChecked ?? 0) > 1

  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const handleOnNoteChange = (event: FormEvent<HTMLTextAreaElement>) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  const submit = async (_: FormState, formData: FormData) => {
    const initialFormState: FormState = {
      errorMessage: null,
      triggerQualityHasError: false,
      exceptionQualityHasError: false
    }

    const checkTriggerQuality = hasTriggers && !triggerQualityAlreadySet
    const triggerQuality = checkTriggerQuality ? Number(formData.get("trigger-quality")) : undefined
    const triggerQualitySet = (triggerQuality ?? 0) > 1

    const checkExceptionQuality = hasExceptions && !exceptionQualityAlreadySet
    const exceptionQuality = checkExceptionQuality ? Number(formData.get("exception-quality")) : undefined
    const exceptionQualitySet = (exceptionQuality ?? 0) > 1

    const note = formData.get("quality-status-note")

    if (checkTriggerQuality && checkExceptionQuality) {
      if (!triggerQualitySet && !exceptionQualitySet) {
        return {
          ...initialFormState,
          errorMessage: "Select at least one: trigger quality or exception quality"
        }
      }
    } else if (checkTriggerQuality && !triggerQualitySet) {
      return {
        ...initialFormState,
        triggerQualityHasError: true
      }
    } else if (checkExceptionQuality && !exceptionQualitySet) {
      return {
        ...initialFormState,
        exceptionQualityHasError: true
      }
    }

    try {
      const response = await axios.post(`${router.basePath}/api/court-cases/${courtCase.errorId}/audit`, {
        csrfToken,
        data: {
          triggerQuality: triggerQualitySet ? triggerQuality : undefined,
          exceptionQuality: exceptionQualitySet ? exceptionQuality : undefined,
          note
        }
      })

      updateCourtCase(response.data.courtCase satisfies DisplayFullCourtCase)
      updateCsrfToken(response.data.csrfToken as string)
    } catch {
      return {
        ...initialFormState,
        errorMessage: "Audit has failed, please refresh"
      }
    }

    return initialFormState
  }

  const [submitResult, submitAction] = useActionState(submit, initialFormState)

  return (
    <Card heading={"Set quality status"}>
      <form
        action={submitAction}
        aria-describedby={submitResult.errorMessage ? "quality-status-form-error" : undefined}
      >
        {submitResult.errorMessage ? (
          <p id="quality-status-form-error" className="govuk-error-message" role="alert">
            {submitResult.errorMessage}
          </p>
        ) : null}
        <fieldset className="govuk-fieldset">
          {hasTriggers && triggerQualityAlreadySet && (
            <p>
              <b id="trigger-quality-label">{"Trigger Quality: "}</b>
              <span aria-labelledby="trigger-quality-label">
                {triggerQualityValues[courtCase.triggerQualityChecked ?? 1]}
              </span>
            </p>
          )}
          {hasExceptions && exceptionQualityAlreadySet && (
            <p>
              <b id="exception-quality-label">{"Exception Quality: "}</b>
              <span aria-labelledby="exception-quality-label">
                {exceptionQualityValues[courtCase.errorQualityChecked ?? 1]}
              </span>
            </p>
          )}
          <DropdownContainer>
            {hasTriggers && !triggerQualityAlreadySet && (
              <TriggerQualityDropdown showError={submitResult.triggerQualityHasError} />
            )}
            {hasExceptions && !exceptionQualityAlreadySet && (
              <ExceptionQualityDropdown showError={submitResult.exceptionQualityHasError} />
            )}
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
