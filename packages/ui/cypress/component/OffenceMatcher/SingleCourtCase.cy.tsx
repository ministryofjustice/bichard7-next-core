import { PncOffence } from "@moj-bichard7/core/types/PncQueryResult"
import { CourtCaseContext } from "context/CourtCaseContext"
import { CsrfTokenContext } from "context/CsrfTokenContext"
import OffenceMatcher from "features/CourtCaseDetails/Tabs/Panels/Offences/Offence/Matcher/OffenceMatcher"
import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import type { Candidates } from "../../../src/types/OffenceMatching"

const courtCase = {} as unknown as DisplayFullCourtCase
const candidates: Candidates[] = [
  {
    courtCaseReference: "97/1626/008395Q",
    offences: [
      {
        offence: {
          cjsOffenceCode: "TH68006",
          sequenceNumber: 1
        }
      } as PncOffence
    ]
  }
]

describe("Offence matcher with single court case", () => {
  describe("Without existing amendments", () => {
    beforeEach(() => {
      cy.mount(
        <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
          <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
            <OffenceMatcher offenceIndex={0} candidates={candidates} isCaseLockedToCurrentUser={true} />
          </CourtCaseContext.Provider>
        </CsrfTokenContext.Provider>
      )
    })

    it("has a default placeholder", () => {
      cy.get("select").should("have.value", null)
      cy.get("select").find(":selected").should("have.text", "Select an offence")
    })

    it("groups dropdown options by CCR", () => {
      cy.get("select").children("optgroup").eq(0).should("have.attr", "label", "97/1626/008395Q")
      cy.get("select").children("optgroup").eq(0).contains("option", "TH68006")
    })

    it("displays matchable offences as dropdown options", () => {
      cy.get("select").contains("option", "TH68006")
      cy.get("select").contains("option", "TH68151").should("not.exist")
      cy.get("select").contains("option", "RT88191").should("not.exist")
    })

    it("displays offences in the correct format", () => {
      cy.get("option")
        .contains("TH68006")
        .invoke("text")
        .then((text) => {
          expect(text).equals("001 - TH68006")
        })
    })

    it("displays 'Added in court' as the last option", () => {
      cy.get("select").last().contains("option", "Added in court").should("have.value", "0")
    })
  })
})

describe("With existing amendments", () => {
  it("loads amended value", () => {
    const amendments: Amendments = {
      offenceReasonSequence: [
        {
          offenceIndex: 0,
          value: 1
        }
      ],
      offenceCourtCaseReferenceNumber: [
        {
          offenceIndex: 0,
          value: "97/1626/008395Q"
        }
      ]
    }

    cy.mount(
      <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments, savedAmendments: {} }, () => {}]}>
          <OffenceMatcher offenceIndex={0} candidates={candidates} isCaseLockedToCurrentUser={true} />
        </CourtCaseContext.Provider>
      </CsrfTokenContext.Provider>
    )

    cy.get("select").should("have.value", "1-97/1626/008395Q")
  })

  it("disables options that already exist in amendments", () => {
    const amendments: Amendments = {
      offenceReasonSequence: [
        {
          offenceIndex: 1,
          value: 1
        }
      ],
      offenceCourtCaseReferenceNumber: [
        {
          offenceIndex: 1,
          value: "97/1626/008395Q"
        }
      ]
    }

    cy.mount(
      <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments, savedAmendments: {} }, () => {}]}>
          <OffenceMatcher offenceIndex={0} candidates={candidates} isCaseLockedToCurrentUser={true} />
        </CourtCaseContext.Provider>
      </CsrfTokenContext.Provider>
    )

    cy.get("select").should("have.value", null)
    cy.get("select").contains("option", "TH68006").should("be.disabled")
  })
})
