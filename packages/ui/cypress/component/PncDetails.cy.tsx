import Permission from "@moj-bichard7/common/types/Permission"
import { CourtCaseContext } from "context/CourtCaseContext"
import { CurrentUserContext } from "context/CurrentUserContext"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"

import PncDetails from "../../src/features/CourtCaseDetails/Sidebar/PncDetails/PncDetails"

describe("PNC details", () => {
  const currentUser = {
    email: "",
    excludedTriggers: [],
    featureFlags: {},
    groups: [],
    hasAccessTo: {
      [Permission.CanResubmit]: false,
      [Permission.CaseDetailsSidebar]: false,
      [Permission.Exceptions]: false,
      [Permission.ListAllCases]: false,
      [Permission.Triggers]: false,
      [Permission.UnlockOtherUsersCases]: false,
      [Permission.ViewReports]: false,
      [Permission.ViewUserManagement]: false
    },
    username: "",
    visibleCourts: [],
    visibleForces: []
  } as DisplayFullUser

  it("displays all PNC data", () => {
    const pncQueryData = {
      checkName: "LEBOWSKI",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          crimeOffenceReference: "XOXO",
          offences: [
            {
              adjudication: {
                offenceTICNumber: 321,
                plea: "NOT GUILTY",
                sentenceDate: "2011-09-25T00:00:00.000Z",
                verdict: "GUILTY"
              },
              disposals: [
                {
                  qtyDate: "2012-01-25T00:00:00.000Z",
                  qtyDuration: "Y999",
                  qtyMonetaryValue: "1000",
                  qtyUnitsFined: "",
                  qualifiers: "AA",
                  text: "This is a dummy text",
                  type: 2007
                }
              ],
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                endDate: "2010-12-31T00:00:00.000Z",
                qualifier1: "Q1",
                qualifier2: "Q2",
                sequenceNumber: 1,
                startDate: "2010-11-28T00:00:00.000Z",
                title: "Theft from the person of another"
              }
            }
          ]
        }
      ],
      forceStationCode: "01ZD",
      pncId: "2021/0000006A"
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
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
      checkName: "LEBOWSKI",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          crimeOffenceReference: "",
          offences: [
            {
              disposals: [
                {
                  type: 2007
                }
              ],
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                sequenceNumber: 1,
                title: "Theft from the person of another"
              }
            }
          ]
        }
      ],
      forceStationCode: "01ZD",
      pncId: "2021/0000006A"
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
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
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".pnc-error-message").should("exist")
    cy.get(".pnc-error-message").contains("PNC details unavailable")
  })

  it("collapses only when the header is clicked", () => {
    const pncQueryData = {
      checkName: "LEBOWSKI",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          crimeOffenceReference: "",
          offences: [
            {
              disposals: [
                {
                  type: 2007
                }
              ],
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                sequenceNumber: 1,
                title: "Theft from the person of another"
              }
            }
          ]
        }
      ],
      forceStationCode: "01ZD",
      pncId: "2021/0000006A"
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
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
      checkName: "LEBOWSKI",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          crimeOffenceReference: "",
          offences: [
            {
              disposals: [
                {
                  type: 2007
                }
              ],
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                sequenceNumber: 1,
                title: "Theft from the person of another"
              }
            }
          ]
        },
        {
          courtCaseReference: "11/2222/000001Z",
          crimeOffenceReference: "",
          offences: [
            {
              disposals: [
                {
                  type: 2010
                }
              ],
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                sequenceNumber: 1,
                title: "Theft from the person of another"
              }
            }
          ]
        }
      ],
      forceStationCode: "01ZD",
      pncId: "2021/0000006A"
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".pnc-offence").eq(0).should("exist")
    cy.get(".pnc-offence").eq(1).should("not.exist")
  })

  it("Displays message 'No disposals' where disposals have empty array", () => {
    const pncQueryData = {
      checkName: "LEBOWSKI",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          crimeOffenceReference: "",
          offences: [
            {
              disposals: [],
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                sequenceNumber: 1,
                title: "Theft from the person of another"
              }
            }
          ]
        }
      ],
      forceStationCode: "01ZD",
      pncId: "2021/0000006A"
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".no-disposals-message").should("exist")
    cy.get(".no-disposals-message").contains("No disposals")
  })

  it("Displays message 'No disposals' where disposals are undefined", () => {
    const pncQueryData = {
      checkName: "LEBOWSKI",
      courtCases: [
        {
          courtCaseReference: "21/2732/000006N",
          crimeOffenceReference: "",
          offences: [
            {
              offence: {
                acpoOffenceCode: "5:5:5:1",
                cjsOffenceCode: "TH68001",
                sequenceNumber: 1,
                title: "Theft from the person of another"
              }
            }
          ]
        }
      ],
      forceStationCode: "01ZD",
      pncId: "2021/0000006A"
    }

    const courtCase = {
      aho: {
        PncQuery: pncQueryData,
        PncQueryDate: "2024-07-10T00:00:00.000Z"
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
          <PncDetails />
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    )

    cy.get(".no-disposals-message").should("exist")
    cy.get(".no-disposals-message").contains("No disposals")
  })
})
