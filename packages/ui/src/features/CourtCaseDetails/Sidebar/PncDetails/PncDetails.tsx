import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useStickyHeight } from "hooks/useStickyHeight"
import { useRef, useState } from "react"
import { formatDisplayedDate } from "utils/date/formattedDate"
import PncCourtCaseAccordion from "./PncCourtCaseAccordion"
import { CourtCases, PncQueryError, UpdatedDate } from "./PncDetails.styles"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  const ref = useRef<HTMLDivElement>(null)
  const [stickyHeight, setStickyHeight] = useState(0)

  useStickyHeight({ setStickyHeight, ref, magicOffset: 330 })

  let stickyStyle = {}

  if (stickyHeight) {
    stickyStyle = {
      height: stickyHeight
    }
  }

  return (
    <>
      <ConditionalRender isRendered={!pncQuery}>
        <PncQueryError className="pnc-error-message">{"PNC details unavailable"}</PncQueryError>
      </ConditionalRender>

      <ConditionalRender isRendered={Boolean(pncQuery)}>
        <UpdatedDate id="pnc-details-update-date">{`Updated ${pncQueryDate ? formatDisplayedDate(pncQueryDate, "dd/MM/yyyy HH:mm:ss") : "-"}`}</UpdatedDate>
        <CourtCases ref={ref} style={stickyStyle}>
          {pncQuery?.courtCases?.map((courtCase, i) => (
            <PncCourtCaseAccordion key={i} index={i} pncCourtCase={courtCase} />
          ))}
        </CourtCases>
      </ConditionalRender>
    </>
  )
}

export default PncDetails
