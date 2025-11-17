import { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import getOffenceCode from "@moj-bichard7/core/lib/offences/getOffenceCode"
import { ScreenReaderOnly, StyledTableHead } from "./OffencesList.styles"
import { OffencesListRow } from "./OffencesListRow"
import { Table, TableBody, TableRow, TableHeader } from "components/Table"

interface OffencesListProps {
  offences: Offence[]
  setDetailedOffenceIndex: (index: number) => void
}

export const OffencesList = ({ offences, setDetailedOffenceIndex }: OffencesListProps) => {
  return (
    <div id={"offences"}>
      <h3 className="govuk-heading-m">{"Offences"}</h3>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableHeader scope="col">
              <ScreenReaderOnly className="sr-only">{"Exception icon"}</ScreenReaderOnly>
            </TableHeader>
            <TableHeader scope="col">{"Offence number"}</TableHeader>
            <TableHeader scope="col">{"Date"}</TableHeader>
            <TableHeader scope="col">{"Code"}</TableHeader>
            <TableHeader scope="col">{"Title"}</TableHeader>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {offences.length > 0 &&
            offences.map((offence, index) => (
              <OffencesListRow
                key={`${getOffenceCode(offence) || ""}-${index}`}
                offence={offence}
                offenceIndex={index}
                onClick={() => setDetailedOffenceIndex(index + 1)}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
