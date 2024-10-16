import { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import { CourtCaseContext } from "context/CourtCaseContext"
import OffenceMatcher from "features/CourtCaseDetails/Tabs/Panels/Offences/Offence/Matcher/OffenceMatcher"
import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import type { Candidates } from "../../../src/types/OffenceMatching"

const courtCase = {} as unknown as DisplayFullCourtCase
const candidates: Candidates[] = [
  {
    courtCaseReference: "12/2732/000015R",
    offences: [
      {
        offence: {
          cjsOffenceCode: "OF61016",
          sequenceNumber: 1
        }
      } as PncOffence
    ]
  },
  {
    courtCaseReference: "12/2732/000016T",
    offences: [
      {
        offence: {
          cjsOffenceCode: "OF61016",
          sequenceNumber: 2
        }
      } as PncOffence
    ]
  }
]

describe("Offence matcher with single court case", () => {
  describe("Without existing amendments", () => {
    beforeEach(() => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <OffenceMatcher offenceIndex={0} candidates={candidates} isCaseLockedToCurrentUser={true} />
        </CourtCaseContext.Provider>
      )
    })

    it("has a default placeholder", () => {
      cy.get("select").should("have.value", null)
      cy.get("select").find(":selected").should("have.text", "Select an offence")
    })

    it("groups dropdown options by CCR", () => {
      cy.get("select").children("optgroup").eq(0).should("have.attr", "label", "12/2732/000015R")
      cy.get("select").children("optgroup").eq(0).contains("option", "001 - OF61016")
      cy.get("select").children("optgroup").eq(1).should("have.attr", "label", "12/2732/000016T")
      cy.get("select").children("optgroup").eq(1).contains("option", "002 - OF61016")
    })

    it("displays matchable offences as dropdown options", () => {
      cy.get("select").contains("option", "OF61016")
      cy.get("select").contains("option", "TH68151").should("not.exist")
      cy.get("select").contains("option", "RT88191").should("not.exist")
    })

    it("displays offences in the correct format", () => {
      cy.get("option")
        .contains("OF61016")
        .invoke("text")
        .then((text) => {
          expect(text).equals("001 - OF61016")
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
          value: "12/2732/000015R"
        }
      ]
    }

    cy.mount(
      <CourtCaseContext.Provider value={[{ courtCase, amendments, savedAmendments: {} }, () => {}]}>
        <OffenceMatcher offenceIndex={0} candidates={candidates} isCaseLockedToCurrentUser={true} />
      </CourtCaseContext.Provider>
    )

    cy.get("select").should("have.value", "1-12/2732/000015R")
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
          value: "12/2732/000015R"
        }
      ]
    }

    cy.mount(
      <CourtCaseContext.Provider value={[{ courtCase, amendments, savedAmendments: {} }, () => {}]}>
        <OffenceMatcher offenceIndex={0} candidates={candidates} isCaseLockedToCurrentUser={true} />
      </CourtCaseContext.Provider>
    )

    cy.get("select").should("have.value", null)
    cy.get("select").contains("option", "001 - OF61016").should("be.disabled")
    cy.get("select").contains("option", "002 - OF61016").should("be.enabled")
  })
})
