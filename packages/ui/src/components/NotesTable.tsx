import DateTime from "components/DateTime"
import { TableHead, TableBody, TableRow, TableHeader, TableCell } from "components/Table"
import { DisplayNote } from "types/display/Notes"
import { StyledNotesTable } from "./NotesTable.styles"

interface Props {
  notes: DisplayNote[]
  displayForce?: boolean
}

export const NotesTable = ({ notes, displayForce }: Props) => {
  return (
    <StyledNotesTable className={"notes-table"}>
      <TableHead>
        <TableRow>
          <TableHeader scope="col">{"User"}</TableHeader>
          <TableHeader scope="col">{"Time"}</TableHeader>
          <TableHeader scope="col">{"Note"}</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {notes.map((note, index) => {
          const userName = note.userFullName
          const userForces = `(${note.user?.visibleForces.slice(0, 3).join(", ")})`

          return (
            <TableRow key={`${note.userId}-${index}`}>
              <TableCell>
                <span>{userName}</span>
                {displayForce && (
                  <>
                    <br />
                    <span>{userForces}</span>
                  </>
                )}
              </TableCell>
              <TableCell>
                <DateTime date={note.createdAt} />
              </TableCell>
              <TableCell style={{ whiteSpace: "pre-wrap" }}>{note.noteText}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </StyledNotesTable>
  )
}
