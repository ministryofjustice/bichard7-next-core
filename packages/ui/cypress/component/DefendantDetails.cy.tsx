import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { GenderCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { format } from "date-fns"
import { CourtCaseContext } from "../../src/context/CourtCaseContext"
import { CurrentUserContext } from "context/CurrentUserContext"
import { DefendantDetails } from "../../src/features/CourtCaseDetails/Tabs/Panels/DefendantDetails"
import { DisplayFullCourtCase } from "../../src/types/display/CourtCases"
import Permission from "types/Permission"
import { DisplayFullUser } from "types/display/Users"

describe("Defendant Details", () => {
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

  it("displays all defendant details", () => {
    const dob = new Date()
    const data: Partial<HearingDefendant> = {
      ArrestSummonsNumber: "1101ZD01000004487545",
      PNCCheckname: "PNCCheckName",
      Address: {
        AddressLine1: "AddressLine1",
        AddressLine2: "AddressLine2",
        AddressLine3: "AddressLine3",
        AddressLine4: "AddressLine4",
        AddressLine5: "AddressLine5"
      },
      RemandStatus: "UB",
      DefendantDetail: {
        GeneratedPNCFilename: "FirstName/LastName",
        BirthDate: dob,
        PersonName: {
          GivenName: ["GivenName"],
          Title: "Title",
          FamilyName: "FamilyName"
        },
        Gender: GenderCode.MALE
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
      <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
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
        GeneratedPNCFilename: "FirstName/LastName",
        PersonName: {
          GivenName: ["FirstName", "MiddleName"],
          FamilyName: "FamilyName"
        },
        Gender: GenderCode.MALE
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
      <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
        <CurrentUserContext.Provider value={{ currentUser }}>
          <DefendantDetails />
        </CurrentUserContext.Provider>
      </CourtCaseContext.Provider>
    )

    cy.contains("td", "Given name").siblings().should("include.text", "FirstName, MiddleName")
  })
})
