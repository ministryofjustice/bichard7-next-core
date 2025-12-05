import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import mapDefendant from "./mapDefendant"

describe("mapDefendant", () => {
  const buildPncUpdateDataset = (familyName?: string, givenName?: string[], organisationName?: string) => {
    return {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              DefendantDetail: {
                PersonName: {
                  FamilyName: familyName,
                  GivenName: givenName
                }
              },
              OrganisationName: organisationName
            }
          }
        }
      },
      PncQuery: {
        courtCases: [
          {
            courtCaseReference: "98/2048/633Y",
            offences: [
              {
                offence: {
                  sequenceNumber: 1,
                  offenceId: "112233"
                }
              }
            ]
          }
        ]
      }
    } as PncUpdateDataset
  }

  it("returns an object with defendantType organisation when defendantLastName does not exist", () => {
    const pncUpdateDataset = buildPncUpdateDataset(undefined, undefined, "dummyOrg")
    const expectedDefendant = {
      defendantType: "organisation",
      defendantOrganisationName: "dummyOrg"
    }

    const defendant = mapDefendant(pncUpdateDataset)

    expect(defendant).toStrictEqual(expectedDefendant)
  })

  it("returns an object with defendantType individual when defendant last name exists", () => {
    const pncUpdateDataset = buildPncUpdateDataset("Brown", ["Adam"])
    const expectedDefendant = {
      defendantType: "individual",
      defendantFirstNames: ["Adam"],
      defendantLastName: "Brown"
    }

    const defendant = mapDefendant(pncUpdateDataset)

    expect(defendant).toStrictEqual(expectedDefendant)
  })
})
