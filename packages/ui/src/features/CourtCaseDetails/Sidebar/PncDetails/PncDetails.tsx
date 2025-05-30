import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { formatDisplayedDate } from "utils/date/formattedDate"
import PncCourtCaseAccordion from "./PncCourtCaseAccordion"
import { CourtCases, PncQueryError, UpdatedDate } from "./PncDetails.styles"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  return (
    <>
      <h2 className="govuk-heading-s govuk-visually-hidden">{"PNC Details"}</h2>

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
