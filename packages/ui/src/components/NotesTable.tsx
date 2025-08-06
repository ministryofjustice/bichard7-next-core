import DateTime from "components/DateTime"
import { DisplayNote } from "types/display/Notes"
import { StyledNotesTable } from "./NotesTable.styles"

interface Props {
  notes: DisplayNote[]
  displayForce?: boolean
}

export const NotesTable = ({ notes, displayForce }: Props) => {
  return (
    <StyledNotesTable className={"govuk-table notes-table"}>
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            {"User"}
          </th>
          <th scope="col" className="govuk-table__header">
            {"Time"}
          </th>
          <th scope="col" className="govuk-table__header">
            {"Note"}
          </th>
        </tr>
      </thead>

      <tbody className="govuk-table__body">
        {notes.map((note, index) => {
          const userName = note.userFullName
          const userForces = `(${note.user?.visibleForces.slice(0, 3).join(", ")})`

          return (
            <tr className="govuk-table__row" key={`${note.userId}-${index}`}>
              <td className="govuk-table__cell">
                <span>{userName}</span>
                {displayForce && (
                  <>
                    <br />
                    <span>{userForces}</span>
                  </>
                )}
              </td>
              <td className="govuk-table__cell">
                <DateTime date={note.createdAt} />
              </td>
              <td className="govuk-table__cell" style={{ whiteSpace: "pre-wrap" }}>
                {note.noteText}
              </td>
            </tr>
          )
        })}
      </tbody>
    </StyledNotesTable>
  )
}
