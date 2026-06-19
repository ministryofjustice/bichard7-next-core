import ForceOwnerApiResponse from "@/types/ForceOwnerApiResponse"
import forces from "@moj-bichard7-developers/bichard7-next-data/dist/data/forces.json"
import { FormGroup } from "components/FormGroup"
import { MAX_NOTE_LENGTH } from "config"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import Link from "next/link"
import { FormEventHandler, useState } from "react"
import { Button } from "./Buttons/Button"
import ButtonsGroup from "./ButtonsGroup"
import Form from "./Form"
import { Label } from "./Label"
import { NoteTextArea } from "./NoteTextArea"
import ForceOwnerTypeahead from "./Typeaheads/ForceOwnerTypeahead"

interface Props {
  backLink: string
}

const ReallocationNotesForm = ({ backLink }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const { courtCase } = useCourtCase()
  const currentForce = forces.find((force) => force.code === courtCase.orgForPoliceFilter?.substring(0, 2))
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedForce, setSelectedForce] = useState<ForceOwnerApiResponse[0] | null>(null)
  const [showError] = useState(false)

  const { csrfToken } = useCsrfToken()

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <Form method="POST" action="#" csrfToken={csrfToken || ""} onSubmit={handleSubmit}>
      <fieldset className="govuk-fieldset">
        <FormGroup>
          <Label size={"s"}>{"Current force owner"}</Label>
          <span className="govuk-body-m">{`${currentForce?.code} - ${currentForce?.name}`}</span>
        </FormGroup>

        <FormGroup>
          <Label size={"s"} htmlFor="force">
            {"New force owner"}
          </Label>

          <div className={"govuk-hint"}>{"Start typing to search for a force to reallocate to"}</div>

          <input type="hidden" name="force" value={selectedForce?.forceCode ?? ""} />

          <ForceOwnerTypeahead
            onSelect={setSelectedForce}
            currentForceOwner={currentForce?.code}
            showError={showError}
          />
        </FormGroup>

        <NoteTextArea
          handleOnNoteChange={handleOnNoteChange}
          noteRemainingLength={noteRemainingLength}
          labelText={"Add a note (optional)"}
          hintText={"Input reason for case reallocation"}
          labelSize={"s"}
          name={"note"}
        />

        <ButtonsGroup>
          <Button id="Reallocate" type="submit" disabled={isSubmitting || showError}>
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
