import { MAX_NOTE_LENGTH } from "config"
import type { ComponentProps, FormEvent } from "react"
import { FormEvent } from "react"
import { FormGroup } from "components/FormGroup"
import { Label } from "components/Label"

interface Props {
  name: string
  labelText: string
  handleOnNoteChange?: (event: FormEvent<HTMLTextAreaElement>) => void
  noteRemainingLength?: number
  showError?: boolean
  hintText?: string
  labelSize?: ComponentProps<typeof Label>["size"]
  errorMessage?: string
  id?: string
  defaultValue?: string
  maxLength?: number
}

export const NoteTextArea = ({
  labelText,
  hintText,
  handleOnNoteChange,
  noteRemainingLength,
  id,
  name,
  showError = false,
  labelSize = "m",
  errorMessage = "The note cannot be empty",
  defaultValue = "",
  maxLength = MAX_NOTE_LENGTH
}: Props) => {
  return (
    <FormGroup id={id} showError={showError}>
      <Label size={labelSize} htmlFor={`id-${name}`}>
        {labelText}
      </Label>

      {hintText ? <div className={"govuk-hint"}>{hintText}</div> : ""}

      {showError ? (
        <p className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {errorMessage}
        </p>
      ) : (
        ""
      )}
      <textarea
        className={"govuk-textarea" + (showError ? " govuk-textarea--error" : "")}
        name={name}
        id={`id-${name}`}
        rows={5}
        maxLength={maxLength}
        onInput={handleOnNoteChange}
        defaultValue={defaultValue}
      />

      {noteRemainingLength ? (
        <div className={"govuk-hint"}>{`You have ${noteRemainingLength} characters remaining`}</div>
      ) : (
        ""
      )}
    </FormGroup>
  )
}
