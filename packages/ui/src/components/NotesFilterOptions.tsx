import RadioButton from "components/RadioButton/RadioButton"
import type { ChangeEvent, Dispatch } from "react"
import type NotesViewOption from "types/NotesViewOption"
import { NOTES_VIEW_OPTIONS } from "types/NotesViewOption"

interface Props {
  selectedOption?: NotesViewOption
  dispatch: Dispatch<NotesViewOption>
}

const NotesFilterOptions: React.FC<Props> = ({ selectedOption, dispatch }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small govuk-radios--inline" data-module="govuk-radios">
        {NOTES_VIEW_OPTIONS.map((option) => {
          const id = `notes-filter-${option.replace(/ /g, "-").toLowerCase()}`
          return (
            <RadioButton
              name={"locked"}
              key={id}
              id={id}
              checked={selectedOption === option || (selectedOption === undefined && option === "View all notes")}
              value={option}
              label={option}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatch(event.target.value as NotesViewOption)
              }}
            />
          )
        })}
      </div>
    </fieldset>
  )
}

export default NotesFilterOptions
