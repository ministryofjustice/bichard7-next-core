import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import getOffenceCode from "@moj-bichard7/core/lib/offences/getOffenceCode"
import { ScreenReaderOnly, TableHeader } from "./OffencesList.styles"
import { OffencesListRow } from "./OffencesListRow"

interface OffencesListProps {
  offences: Offence[]
  setDetailedOffenceIndex: (index: number) => void
}

export const OffencesList = ({ offences, setDetailedOffenceIndex }: OffencesListProps) => {
  return (
    <div id={"offences"}>
      <h3 className="govuk-heading-m">{"Offences"}</h3>
      <table className="govuk-table">
        <TableHeader className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              <ScreenReaderOnly className="sr-only">{"Exception icon"}</ScreenReaderOnly>
            </th>
            <th scope="col" className="govuk-table__header">
              {"Offence number"}
            </th>
            <th scope="col" className="govuk-table__header">
              {"Date"}
            </th>
            <th scope="col" className="govuk-table__header">
              {"Code"}
            </th>
            <th scope="col" className="govuk-table__header">
              {"Title"}
            </th>
          </tr>
        </TableHeader>

        <tbody className="govuk-table__body">
          {offences.length > 0 &&
            offences.map((offence, index) => (
              <OffencesListRow
                key={`${getOffenceCode(offence) || ""}-${index}`}
                offence={offence}
                offenceIndex={index}
                onClick={() => setDetailedOffenceIndex(index + 1)}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}
