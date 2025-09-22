import { QualityStatusCard } from "features/CourtCaseDetails/Sidebar/Audit/QualityStatusCard"
import { CsrfTokenContext } from "context/CsrfTokenContext"
import "../../../styles/globals.scss"

describe("QualityStatusCard", () => {
  it("mounts", () => {
    cy.mount(
      <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
        <QualityStatusCard />
      </CsrfTokenContext.Provider>
    )
  })
})
