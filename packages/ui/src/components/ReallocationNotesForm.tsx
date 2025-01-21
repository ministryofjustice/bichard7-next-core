import { forces } from "@moj-bichard7-developers/bichard7-next-data"
import { MAX_NOTE_LENGTH } from "config"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { Button, Fieldset, FormGroup, Label, LabelText, Select } from "govuk-react"
import Link from "next/link"
import { FormEventHandler, useState } from "react"
import getForcesForReallocation from "services/getForcesForReallocation"
import ButtonsGroup from "./ButtonsGroup"
import Form from "./Form"
import { NoteTextArea } from "./NoteTextArea"

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

  const { csrfToken } = useCsrfToken()

  return (
    <Form method="POST" action="#" csrfToken={csrfToken || ""}>
      <Fieldset>
        <FormGroup>
          <Label>
            <LabelText className="govuk-!-font-weight-bold">{"Current force owner"}</LabelText>
          </Label>
          <span className="govuk-body-m">{`${currentForce?.code} - ${currentForce?.name}`}</span>
        </FormGroup>
        <FormGroup>
          <Label>
            <LabelText className="govuk-!-font-weight-bold">{"New force owner"}</LabelText>
          </Label>
          <Select input={{ name: "force" }} label={""}>
            {forcesForReallocation.map(({ code, name }) => (
              <option key={code} value={code}>
                {`${code} - ${name}`}
              </option>
            ))}
          </Select>
        </FormGroup>

        <NoteTextArea
          handleOnNoteChange={handleOnNoteChange}
          noteRemainingLength={noteRemainingLength}
          labelText={"Add a note (optional)"}
          hintText={"Input reason for case reallocation"}
          labelSize={"govuk-label--s"}
          name={"note"}
        />

        <ButtonsGroup>
          <Button id="Reallocate" type="submit">
            {"Reallocate Case"}
          </Button>
          <Link href={backLink} className="govuk-link">
            {"Cancel"}
          </Link>
        </ButtonsGroup>
      </Fieldset>
    </Form>
  )
}

export default ReallocationNotesForm
