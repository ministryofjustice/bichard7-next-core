import type { ChangeEvent, Dispatch } from "react"
import type NotesViewOption from "types/NotesViewOption"

import RadioButton from "components/RadioButton/RadioButton"
import { NOTES_VIEW_OPTIONS } from "types/NotesViewOption"

interface Props {
  dispatch: Dispatch<NotesViewOption>
  selectedOption?: NotesViewOption
}

const NotesFilterOptions: React.FC<Props> = ({ dispatch, selectedOption }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small govuk-radios--inline" data-module="govuk-radios">
        {NOTES_VIEW_OPTIONS.map((option) => {
          const id = `notes-filter-${option.replace(/ /g, "-").toLowerCase()}`
          return (
            <RadioButton
              checked={selectedOption === option || (selectedOption === undefined && option === "View all notes")}
              id={id}
              key={id}
              label={option}
              name={"locked"}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatch(event.target.value as NotesViewOption)
              }}
              value={option}
            />
          )
        })}
      </div>
    </fieldset>
  )
}

export default NotesFilterOptions
