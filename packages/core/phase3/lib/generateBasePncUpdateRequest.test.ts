import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import generateBasePncUpdateRequest from "./generateBasePncUpdateRequest"

describe("generateBasePncUpdateRequest", () => {
  it("returns a base PNC update request object", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              CRONumber: "CRONumber",
              PNCCheckname: "PNCCheckname",
              PNCIdentifier: "2024/1234567K"
            },
            ForceOwner: {
              BottomLevelCode: "00",
              OrganisationUnitCode: "01ZD00",
              SecondLevelCode: "01",
              ThirdLevelCode: "ZD",
              TopLevelCode: undefined
            }
          }
        }
      }
    } as unknown as PncUpdateDataset

    const baseUpdateRequest = generateBasePncUpdateRequest(pncUpdateDataset)

    expect(baseUpdateRequest).toStrictEqual({
      croNumber: "CRONumber",
      forceStationCode: "01YZ",
      pncCheckName: "PNCCheckname",
      pncIdentifier: "24/1234567K"
    })
  })
})
