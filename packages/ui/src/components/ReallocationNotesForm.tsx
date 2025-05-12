import { forces } from "@moj-bichard7-developers/bichard7-next-data"
import { MAX_NOTE_LENGTH } from "config"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import Link from "next/link"
import { FormEventHandler, useState } from "react"
import getForcesForReallocation from "services/getForcesForReallocation"
import { Button } from "./Buttons/Button"
import ButtonsGroup from "./ButtonsGroup"
import Form from "./Form"
import { NoteTextArea } from "./NoteTextArea"
import { NewForceOwner } from "./ReallocationNotesForm.styles"

interface Props {
  backLink: string
}

const ReallocationNotesForm = ({ backLink }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const { courtCase } = useCourtCase()
  const currentForce = forces.find((force) => force.code === courtCase.orgForPoliceFilter?.substring(0, 2))
  const forcesForReallocation = getForcesForReallocation(currentForce?.code)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { csrfToken } = useCsrfToken()

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <Form method="POST" action="#" csrfToken={csrfToken || ""} onSubmit={handleSubmit}>
      <fieldset className="govuk-fieldset">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s">{"Current force owner"}</label>
          <span className="govuk-body-m">{`${currentForce?.code} - ${currentForce?.name}`}</span>
        </div>

        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="force">
            {"New force owner"}
          </label>
          <NewForceOwner className="govuk-select" name="force" id="force">
            {forcesForReallocation.map(({ code, name }) => (
              <option key={code} value={code}>
                {`${code} - ${name}`}
              </option>
            ))}
          </NewForceOwner>
        </div>

        <NoteTextArea
          handleOnNoteChange={handleOnNoteChange}
          noteRemainingLength={noteRemainingLength}
          labelText={"Add a note (optional)"}
          hintText={"Input reason for case reallocation"}
          labelSize={"govuk-label--s"}
          name={"note"}
        />

        <ButtonsGroup>
          <Button id="Reallocate" type="submit" disabled={isSubmitting}>
            {"Reallocate Case"}
          </Button>
          <Link href={backLink} className="govuk-link">
            {"Cancel"}
          </Link>
        </ButtonsGroup>
      </fieldset>
    </Form>
  )
}

export default ReallocationNotesForm
