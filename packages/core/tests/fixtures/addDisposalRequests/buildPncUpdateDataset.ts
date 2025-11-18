import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

export const buildPncUpdateDataset = (familyName?: string, givenName?: string[], organisationName?: string) => {
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
          ],
          courtCaseId: "ABC123"
        }
      ]
    }
  } as PncUpdateDataset
}
