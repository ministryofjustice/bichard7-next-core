import DateTime from "components/DateTime"
import { Table } from "govuk-react"
import { DisplayNote } from "types/display/Notes"

interface Props {
  notes: DisplayNote[]
  displayForce?: boolean
}

export const NotesTable = ({ notes, displayForce }: Props) => {
  return (
    <Table
      className={"notes-table"}
      head={
        <Table.Row>
          <Table.CellHeader>{"User"}</Table.CellHeader>
          <Table.CellHeader>{"Time"}</Table.CellHeader>
          <Table.CellHeader>{"Note"}</Table.CellHeader>
        </Table.Row>
      }
    >
      {notes.map((note, index) => {
        const userName = note.userFullName
        const userForces = `(${note.user?.visibleForces.slice(0, 3).join(", ")})`

        return (
          <Table.Row key={index}>
            <Table.Cell>
              <span>{userName}</span>
              {displayForce && (
                <>
                  <br />
                  <span>{userForces}</span>
                </>
              )}
            </Table.Cell>
            <Table.Cell>
              <DateTime date={note.createdAt} />
            </Table.Cell>
            <Table.Cell style={{ whiteSpace: "pre-wrap" }}>{note.noteText}</Table.Cell>
          </Table.Row>
        )
      })}
    </Table>
  )
}
