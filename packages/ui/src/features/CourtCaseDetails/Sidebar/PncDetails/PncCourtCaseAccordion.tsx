import type { PncCourtCase } from "@moj-bichard7/core/types/PncQueryResult"

import ConditionalRender from "components/ConditionalRender"
import { useState } from "react"

import Disposal from "./Disposal"
import {
  CCR,
  ChevronContainer,
  CourtCase,
  CourtCaseHeader,
  CourtCaseHeaderContainer,
  CrimeOffenceReference,
  DisposalHeader,
  Offence
} from "./PncCourtCaseAccordion.styles"
import PncOffenceDetails from "./PncOffenceDetails"

interface PncCourtCaseAccordionProps {
  index: number
  pncCourtCase: PncCourtCase
}

const PncCourtCaseAccordion = ({
  index,
  pncCourtCase: { courtCaseReference, crimeOffenceReference, offences }
}: PncCourtCaseAccordionProps) => {
  const [isContentVisible, setIsContentVisible] = useState<boolean>(index === 0 ? true : false)
  const toggleContentVisibility = () => setIsContentVisible((previousState) => !previousState)

  const chevronPosition = isContentVisible ? "govuk-accordion-nav__chevron--up" : "govuk-accordion-nav__chevron--down"

  return (
    <CourtCase key={courtCaseReference}>
      <CourtCaseHeaderContainer
        aria-controls={`CCR-${courtCaseReference}-content`}
        aria-expanded={isContentVisible}
        aria-label={`CCR-${courtCaseReference}`}
        className={`courtcase-toggle ${isContentVisible ? "expanded" : ""}`}
        onClick={toggleContentVisibility}
      >
        <CourtCaseHeader>
          <CCR className="govuk-heading-m">{courtCaseReference}</CCR>
          <CrimeOffenceReference>
            <div className={"heading"}>{"Crime Offence Reference"}</div>
            <div id={"crime-offence-reference"}>{crimeOffenceReference || "-"}</div>
          </CrimeOffenceReference>
        </CourtCaseHeader>

        <ChevronContainer>
          <span className={`govuk-accordion-nav__chevron ${chevronPosition} chevron`}></span>
        </ChevronContainer>
      </CourtCaseHeaderContainer>

      {isContentVisible && (
        <div id={`CCR-${courtCaseReference}-content`}>
          {offences?.map(({ adjudication, disposals, offence: details }, i) => {
            const hasDisposals = disposals?.length !== undefined && disposals.length > 0

            return (
              <Offence className="pnc-offence" key={`${i}-${details.sequenceNumber}`}>
                <PncOffenceDetails adjudication={adjudication} details={details} />
                <DisposalHeader>{"Disposals"}</DisposalHeader>
                <ConditionalRender isRendered={!hasDisposals}>
                  <p className={"no-disposals-message"}>{"No disposals"}</p>
                </ConditionalRender>
                <ConditionalRender isRendered={hasDisposals}>
                  {disposals?.map((d, j) => <Disposal key={`${j}-${d.type}`} {...d} />)}
                </ConditionalRender>
                <ConditionalRender isRendered={offences.length !== i + 1}>
                  <hr />
                </ConditionalRender>
              </Offence>
            )
          })}
        </div>
      )}
    </CourtCase>
  )
}

export default PncCourtCaseAccordion
