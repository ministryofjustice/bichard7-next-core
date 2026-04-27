import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

type BuildPncUpdateDatasetParams = {
  familyName?: string
  givenName?: string[]
  organisationName?: string
}

export const buildPncUpdateDataset = ({
  familyName,
  givenName,
  organisationName
}: BuildPncUpdateDatasetParams = {}) => {
  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            ArrestSummonsNumber: "11/01ZD/01/1448754K",
            PNCIdentifier: "1950/123X",
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
                offenceId: "66cdba73-c8a7-426d-a766-02e449843a69"
              }
            },
            {
              offence: {
                sequenceNumber: 2,
                offenceId: "025459be-b60b-4919-8b7c-67371f2ca80b"
              }
            }
          ],
          courtCaseId: "ABC123"
        }
      ]
    }
  } as PncUpdateDataset
}
