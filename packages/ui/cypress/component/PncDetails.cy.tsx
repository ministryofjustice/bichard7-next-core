import { CourtCaseContext } from "context/CourtCaseContext"
import { CurrentUserContext } from "context/CurrentUserContext"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import Permission from "types/Permission"
import PncDetails from "../../src/features/CourtCaseDetails/Sidebar/PncDetails/PncDetails"

describe("PNC details", () => {
  const currentUser = {
    username: "",
    email: "",
    visibleForces: [],
    visibleCourts: [],
    excludedTriggers: [],
    featureFlags: {},
    groups: [],
    hasAccessTo: {
      [Permission.CaseDetailsSidebar]: false,
      [Permission.Exceptions]: false,
      [Permission.Triggers]: false,
      [Permission.UnlockOtherUsersCases]: false,
      [Permission.ListAllCases]: false,
      [Permission.ViewReports]: false,
      [Permission.ViewUserManagement]: false
    }
  } as DisplayFullUser

  it("displays all PNC data", () => {
    const pncQueryData = {
      forceStationCode: "01ZD",
      checkName: "LEBOWSKI",
      pncId: "2021/0000006A",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                title: "Theft from the person of another",
                sequenceNumber: 1,
                qualifier1: "Q1",
                qualifier2: "Q2",
                startDate: "2010-11-28T00:00:00.000Z",
                endDate: "2010-12-31T00:00:00.000Z"
              },
              adjudication: {
                verdict: "GUILTY",
                sentenceDate: "2011-09-25T00:00:00.000Z",
                plea: "NOT GUILTY",
                offenceTICNumber: 321
              },
              disposals: [
                {
                  qtyDate: "2012-01-25T00:00:00.000Z",
                  qtyDuration: "Y999",
                  type: 2007,
                  qtyUnitsFined: "",
                  qtyMonetaryValue: "1000",
                  qualifiers: "AA",
                  text: "This is a dummy text"
                }
              ]
            }
          ],
          crimeOffenceReference: "XOXO"
        }
      ]
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get("#pnc-details-update-date").contains("Updated 10/07/2024 01:00:00").should("exist")
    cy.get("h1").contains("21/2732/000006N").should("exist")
    cy.get("#crime-offence-reference").contains("XOXO").should("exist")
    cy.get(".heading").children().first().contains("001 - TH68001").should("exist")
    cy.get(".heading").children().last().contains("ACPO 5:5:5:1").should("exist")
    cy.get("#offence-title").contains("Theft from the person of another").should("exist")
    cy.get("#start-date").contains("28/11/2010 00:00").should("exist")
    cy.get("#end-date").contains("31/12/2010 00:00").should("exist")
    cy.get("#qualifier-1").contains("Q1").should("exist")
    cy.get("#qualifier-2").contains("Q2").should("exist")
    cy.get("#adjudication").contains("GUILTY").should("exist")
    cy.get("#plea").contains("NOT GUILTY").should("exist")
    cy.get("#date-of-sentence").contains("25/09/2011").should("exist")
    cy.get("#tic-number").contains("321").should("exist")
    cy.get(".disposal").children().first().contains("Disposal - 2007").should("exist")
    cy.get("#disposal-date").contains("25/01/2012").should("exist")
    cy.get("#disposal-qualifiers").contains("AA").should("exist")
    cy.get("#disposal-duration").contains("Y999").should("exist")
    cy.get("#disposal-monetary-value").contains("1000").should("exist")
    cy.get("#disposal-units-fined").should("not.exist")
    cy.get("summary").first().click()
    cy.get(".disposal-text").contains("This is a dummy text").should("exist")
  })

  it("displays missing pnc data as dash", () => {
    const pncQueryData = {
      forceStationCode: "01ZD",
      checkName: "LEBOWSKI",
      pncId: "2021/0000006A",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                title: "Theft from the person of another",
                sequenceNumber: 1
              },
              disposals: [
                {
                  type: 2007
                }
              ]
            }
          ],
          crimeOffenceReference: ""
        }
      ]
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get("#crime-offence-reference").contains("-").should("exist")
    cy.get("#start-date").contains("-").should("exist")
    cy.get("#end-date").contains("-").should("exist")
    cy.get("#qualifier-1").contains("-").should("exist")
    cy.get("#qualifier-2").contains("-").should("exist")
    cy.get("#adjudication").contains("-").should("exist")
    cy.get("#plea").contains("-").should("exist")
    cy.get("#date-of-sentence").contains("-").should("exist")
    cy.get("#tic-number").contains("-").should("exist")
    cy.get(".disposal").children().first().contains("Disposal - 2007").should("exist")
    cy.get("#disposal-date").contains("-").should("exist")
    cy.get("#disposal-qualifiers").contains("-").should("exist")
    cy.get("#disposal-duration").should("not.exist")
    cy.get("#disposal-monetary-value").should("not.exist")
    cy.get("#disposal-units-fined").should("not.exist")
    cy.get(".disposal-text").should("not.exist")
    cy.get(".disposal-text-absent").contains("No disposal text").should("exist")
  })

  it("Displays PNC data erorr when query fails", () => {
    const courtCase = {
      aho: {
        PncQuery: undefined,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".pnc-error-message").should("exist")
    cy.get(".pnc-error-message").contains("PNC details unavailable")
  })

  it("collapses only when the header is clicked", () => {
    const pncQueryData = {
      forceStationCode: "01ZD",
      checkName: "LEBOWSKI",
      pncId: "2021/0000006A",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                title: "Theft from the person of another",
                sequenceNumber: 1
              },
              disposals: [
                {
                  type: 2007
                }
              ]
            }
          ],
          crimeOffenceReference: ""
        }
      ]
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".pnc-offence").should("exist")
    cy.get(".courtcase-toggle").click()
    cy.get(".pnc-offence").should("not.exist")

    cy.get(".courtcase-toggle").click()
    cy.get(".pnc-offence").should("exist")
    cy.get(".pnc-offence").click()
    cy.get(".pnc-offence").should("exist")
  })

  it("Displays only first courtCase opened when there are multiple courtCases", () => {
    const pncQueryData = {
      forceStationCode: "01ZD",
      checkName: "LEBOWSKI",
      pncId: "2021/0000006A",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                title: "Theft from the person of another",
                sequenceNumber: 1
              },
              disposals: [
                {
                  type: 2007
                }
              ]
            }
          ],
          crimeOffenceReference: ""
        },
        {
          courtCaseReference: "11/2222/000001Z",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                title: "Theft from the person of another",
                sequenceNumber: 1
              },
              disposals: [
                {
                  type: 2010
                }
              ]
            }
          ],
          crimeOffenceReference: ""
        }
      ]
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".pnc-offence").eq(0).should("exist")
    cy.get(".pnc-offence").eq(1).should("not.exist")
  })

  it("Displays message 'No disposals' where disposals have empty array", () => {
    const pncQueryData = {
      forceStationCode: "01ZD",
      checkName: "LEBOWSKI",
      pncId: "2021/0000006A",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                title: "Theft from the person of another",
                sequenceNumber: 1
              },
              disposals: []
            }
          ],
          crimeOffenceReference: ""
        }
      ]
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".no-disposals-message").should("exist")
    cy.get(".no-disposals-message").contains("No disposals")
  })

  it("Displays message 'No disposals' where disposals are undefined", () => {
    const pncQueryData = {
      forceStationCode: "01ZD",
      checkName: "LEBOWSKI",
      pncId: "2021/0000006A",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                title: "Theft from the person of another",
                sequenceNumber: 1
              }
            }
          ],
          crimeOffenceReference: ""
        }
      ]
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".no-disposals-message").should("exist")
    cy.get(".no-disposals-message").contains("No disposals")
  })
})
