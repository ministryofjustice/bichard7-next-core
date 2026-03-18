import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type { DisplayFullUser } from "types/display/Users"

import Header from "features/CourtCaseDetails/Header"
import { CourtCaseContext } from "context/CourtCaseContext"
import { CsrfTokenContext } from "context/CsrfTokenContext"
import { CurrentUserContext } from "context/CurrentUserContext"
import { PreviousPathContext } from "context/PreviousPathContext"
import { MockNextRouter } from "../../support/MockNextRouter"

import Permission from "@moj-bichard7/common/types/Permission"

import "../../../styles/globals.scss"
import HO100206 from "../../fixtures/HO100206.json"

describe("Header", () => {
  const courtCase = HO100206 as unknown as DisplayFullCourtCase

  const currentUser = { hasAccessTo: { [Permission.Exceptions]: true } } as unknown as DisplayFullUser

  function mount(previousPath = "") {
    cy.mount(
      <MockNextRouter basePath={"/bichard"}>
        <PreviousPathContext.Provider value={{ previousPath }}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <CurrentUserContext.Provider value={{ currentUser }}>
              <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
                <Header canReallocate={true} />
              </CourtCaseContext.Provider>
            </CurrentUserContext.Provider>
          </CsrfTokenContext.Provider>
        </PreviousPathContext.Provider>
      </MockNextRouter>
    )
  }

  it("mounts", () => {
    mount()
  })

  it("return to case list has correct URL when no previous path", () => {
    mount()

    cy.get("a#return-to-case-list").should("have.text", "Return to case list").should("have.attr", "href", "/bichard")
  })

  it("return to case list links to audit list when coming from the audit case list", () => {
    mount("/audit/1?pageNum=1")

    cy.get("a#return-to-case-list")
      .should("have.text", "Return to audit case list")
      .should("have.attr", "href", "/bichard/audit/1?pageNum=1")
  })

  it("return to case list has correct URL when not coming from audit case list", () => {
    mount("/not-audit")

    cy.get("a#return-to-case-list").should("have.text", "Return to case list").should("have.attr", "href", "/bichard")
  })
})
