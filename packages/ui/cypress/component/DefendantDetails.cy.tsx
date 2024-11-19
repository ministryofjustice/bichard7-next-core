import Permission from "@moj-bichard7/common/types/Permission"
import { HearingDefendant } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { GenderCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { CurrentUserContext } from "context/CurrentUserContext"
import { format } from "date-fns"
import { DisplayFullUser } from "types/display/Users"

import { CourtCaseContext } from "../../src/context/CourtCaseContext"
import { DefendantDetails } from "../../src/features/CourtCaseDetails/Tabs/Panels/DefendantDetails"
import { DisplayFullCourtCase } from "../../src/types/display/CourtCases"

describe("Defendant Details", () => {
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

  it("displays all defendant details", () => {
    const dob = new Date()
    const data: Partial<HearingDefendant> = {
      Address: {
        AddressLine1: "AddressLine1",
        AddressLine2: "AddressLine2",
        AddressLine3: "AddressLine3",
        AddressLine4: "AddressLine4",
        AddressLine5: "AddressLine5"
      },
      ArrestSummonsNumber: "1101ZD01000004487545",
      DefendantDetail: {
        BirthDate: dob,
        Gender: GenderCode.MALE,
        GeneratedPNCFilename: "FirstName/LastName",
        PersonName: {
          FamilyName: "FamilyName",
          GivenName: ["GivenName"],
          Title: "Title"
        }
      },
      PNCCheckname: "PNCCheckName",
      RemandStatus: "UB"
    }

    const courtCase = {
      aho: {
        AnnotatedHearingOutcome: {
          HearingOutcome: {
            Case: {
              HearingDefendant: data
            }
          }
        },
        Exceptions: []
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
        <CurrentUserContext.Provider value={{ currentUser }}>
          <DefendantDetails />
        </CurrentUserContext.Provider>
      </CourtCaseContext.Provider>
    )

    cy.contains("td", "ASN").siblings().should("include.text", data.ArrestSummonsNumber)
    cy.contains("td", "PNC Check name").siblings().should("include.text", data.PNCCheckname)
    cy.contains("td", "Given name").siblings().should("include.text", data.DefendantDetail?.PersonName.GivenName)
    cy.contains("td", "Family name").siblings().should("include.text", data.DefendantDetail?.PersonName.FamilyName)
    cy.contains("td", "Title").siblings().should("include.text", data.DefendantDetail?.PersonName.Title)
    cy.contains("td", "Date of birth")
      .siblings()
      .should("include.text", format(data.DefendantDetail?.BirthDate as Date, "dd/MM/yyyy"))
    cy.contains("td", "Gender").siblings().should("include.text", "1 (male)")

    cy.contains("td", "Address")
      .siblings()
      .should("include.text", data.Address?.AddressLine1)
      .should("include.text", data.Address?.AddressLine2)
      .should("include.text", data.Address?.AddressLine3)
      .should("include.text", data.Address?.AddressLine4)
      .should("include.text", data.Address?.AddressLine5)

    cy.contains("td", "PNC file name").siblings().should("include.text", data.DefendantDetail?.GeneratedPNCFilename)
    cy.contains("td", "Remand status").siblings().contains("Unconditional bail")
  })

  it("render multiple given names", () => {
    const data: Partial<HearingDefendant> = {
      Address: {
        AddressLine1: "AddressLine1"
      },
      DefendantDetail: {
        Gender: GenderCode.MALE,
        GeneratedPNCFilename: "FirstName/LastName",
        PersonName: {
          FamilyName: "FamilyName",
          GivenName: ["FirstName", "MiddleName"]
        }
      }
    }

    const courtCase = {
      aho: {
        AnnotatedHearingOutcome: {
          HearingOutcome: {
            Case: {
              HearingDefendant: data
            }
          }
        },
        Exceptions: []
      }
    } as unknown as DisplayFullCourtCase

    cy.mount(
      <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
        <CurrentUserContext.Provider value={{ currentUser }}>
          <DefendantDetails />
        </CurrentUserContext.Provider>
      </CourtCaseContext.Provider>
    )

    cy.contains("td", "Given name").siblings().should("include.text", "FirstName, MiddleName")
  })
})
