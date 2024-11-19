import type { OrganisationUnitCodes } from "../../../types/AnnotatedHearingOutcome"

import parseSpiResult from "../../../lib/parse/parseSpiResult"
import transformSpiToAho from "../../../lib/parse/transformSpiToAho"
import generateMessage from "../../tests/helpers/generateMessage"
import generateMockAho from "../../tests/helpers/generateMockAho"
import enrichForceOwner from "./enrichForceOwner"

describe("enrichForceOwner", () => {
  it("should return AHO enriched with force owner", () => {
    const aho = generateMockAho()
    const result = enrichForceOwner(aho)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })

  it("should enrich the force from a valid PNC forceStationCode", () => {
    const incomingMessage = generateMessage({ offences: [{ results: [{}] }] })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)
    aho.PncQuery = {
      checkName: "",
      forceStationCode: "06",
      pncId: ""
    }

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      BottomLevelCode: "00",
      OrganisationUnitCode: "060000",
      SecondLevelCode: "06",
      ThirdLevelCode: "00"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force and station from a valid PNC forceStationCode", () => {
    const incomingMessage = generateMessage({ offences: [{ results: [{}] }] })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)
    aho.PncQuery = {
      checkName: "",
      forceStationCode: "06M2",
      pncId: ""
    }
    const resultAho = enrichForceOwner(aho)
    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      BottomLevelCode: "00",
      OrganisationUnitCode: "06M200",
      SecondLevelCode: "06",
      ThirdLevelCode: "M2"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force and station from the PTIURN if there's no forceStationCode", () => {
    const incomingMessage = generateMessage({
      offences: [{ results: [{}] }],
      PTIURN: "01ZD0303908"
    })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      BottomLevelCode: "00",
      OrganisationUnitCode: "01ZD00",
      SecondLevelCode: "01",
      ThirdLevelCode: "ZD"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force and station from the ASN if there's no PTIURN", () => {
    const incomingMessage = generateMessage({
      ASN: "1146AA0100000448754E",
      offences: [{ results: [{}] }],
      PTIURN: ""
    })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      BottomLevelCode: "00",
      OrganisationUnitCode: "46AA00",
      SecondLevelCode: "46",
      ThirdLevelCode: "AA"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force from the courtHearingLocation if there's no ASN", () => {
    const incomingMessage = generateMessage({
      ASN: "",
      courtHearingLocation: "B01EF01",
      offences: [{ results: [{}] }],
      PTIURN: ""
    })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      BottomLevelCode: "00",
      OrganisationUnitCode: "010000",
      SecondLevelCode: "01",
      ThirdLevelCode: "00"
    } as OrganisationUnitCodes)
  })
})
