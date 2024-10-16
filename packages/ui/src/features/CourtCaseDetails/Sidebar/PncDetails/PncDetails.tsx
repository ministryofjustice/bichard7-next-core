import { useCourtCase } from "context/CourtCaseContext"
import { UpdatedDate, CourtCases, PncQueryError } from "./PncDetails.styles"
import PncCourtCaseAccordion from "./PncCourtCaseAccordion"
import { formatDisplayedDate } from "utils/date/formattedDate"
import ConditionalRender from "components/ConditionalRender"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  return (
    <>
      <ConditionalRender isRendered={!pncQuery}>
        <PncQueryError className="pnc-error-message">{"PNC details unavailable"}</PncQueryError>
      </ConditionalRender>

      <ConditionalRender isRendered={Boolean(pncQuery)}>
        <UpdatedDate id="pnc-details-update-date">{`Updated ${pncQueryDate ? formatDisplayedDate(pncQueryDate, "dd/MM/yyyy HH:mm:ss") : "-"}`}</UpdatedDate>
        <CourtCases>
          {pncQuery?.courtCases?.map((courtCase, i) => (
            <PncCourtCaseAccordion key={i} index={i} pncCourtCase={courtCase} />
          ))}
        </CourtCases>
      </ConditionalRender>
    </>
  )
}

export default PncDetails
