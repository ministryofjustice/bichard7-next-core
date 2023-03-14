import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import generateMessage from "../../../tests/helpers/generateMessage"
import generateMockAho from "../../../tests/helpers/generateMockAho"
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
      forceStationCode: "06",
      checkName: "",
      pncId: ""
    }

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      SecondLevelCode: "06",
      ThirdLevelCode: "00",
      BottomLevelCode: "00",
      OrganisationUnitCode: "060000"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force and station from a valid PNC forceStationCode", () => {
    const incomingMessage = generateMessage({ offences: [{ results: [{}] }] })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)
    aho.PncQuery = {
      forceStationCode: "06M2",
      checkName: "",
      pncId: ""
    }
    const resultAho = enrichForceOwner(aho)
    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      SecondLevelCode: "06",
      ThirdLevelCode: "M2",
      BottomLevelCode: "00",
      OrganisationUnitCode: "06M200"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force and station from the PTIURN if there's no forceStationCode", () => {
    const incomingMessage = generateMessage({
      PTIURN: "01ZD0303908",
      offences: [{ results: [{}] }]
    })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      SecondLevelCode: "01",
      ThirdLevelCode: "ZD",
      BottomLevelCode: "00",
      OrganisationUnitCode: "01ZD00"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force and station from the ASN if there's no PTIURN", () => {
    const incomingMessage = generateMessage({
      PTIURN: "",
      ASN: "1146AA0100000448754E",
      offences: [{ results: [{}] }]
    })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      SecondLevelCode: "46",
      ThirdLevelCode: "AA",
      BottomLevelCode: "00",
      OrganisationUnitCode: "46AA00"
    } as OrganisationUnitCodes)
  })

  it("should enrich the force from the courtHearingLocation if there's no ASN", () => {
    const incomingMessage = generateMessage({
      PTIURN: "",
      ASN: "",
      courtHearingLocation: "B01EF01",
      offences: [{ results: [{}] }]
    })
    const spiResult = parseSpiResult(incomingMessage)
    const aho = transformSpiToAho(spiResult)

    const resultAho = enrichForceOwner(aho)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual({
      SecondLevelCode: "01",
      ThirdLevelCode: "00",
      BottomLevelCode: "00",
      OrganisationUnitCode: "010000"
    } as OrganisationUnitCodes)
  })
})
