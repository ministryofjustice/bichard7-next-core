import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import { CourtCaseContext } from "context/CourtCaseContext"
import { CurrentUserContext } from "context/CurrentUserContext"
import { AsnField } from "features/CourtCaseDetails/Tabs/Panels/EditableFields/AsnField"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import HO100206 from "../fixtures/HO100206.json"

describe("AsnField", () => {
  const courtCase = HO100206 as unknown as DisplayFullCourtCase
  courtCase.canUserEditExceptions = true
  courtCase.phase = Phase.HEARING_OUTCOME

  const currentUser = {
    featureFlags: { exceptionsEnabled: true }
  } as unknown as DisplayFullUser

  it("formats the full Asn with forward slashes", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider
          value={[{ courtCase, amendments: { asn: "1101ZD0100000448754K" }, savedAmendments: {} }, () => {}]}
        >
          <AsnField />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get("input#asn")
      .invoke("val")
      .then((val) => {
        expect(val).not.to.equals("1101ZD0100000448754K")
        expect(val).equals("11/01ZD/01/00000448754K")
      })
  })

  it("formats 2 digits Asn with forward slashes", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "11" }, savedAmendments: {} }, () => {}]}>
          <AsnField />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get("input#asn")
      .invoke("val")
      .then((val) => {
        expect(val).not.to.equals("11")
        expect(val).equals("11/")
      })
  })

  it("formats 3 digits Asn with forward slashes", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "110" }, savedAmendments: {} }, () => {}]}>
          <AsnField />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get("input#asn")
      .invoke("val")
      .then((val) => {
        expect(val).not.to.equals("110")
        expect(val).equals("11/0")
      })
  })
})
