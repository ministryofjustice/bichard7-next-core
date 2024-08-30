import isException from "./isException"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"
import HO100302_1 from "../../../../test/test-data/HO100302_1.json"
import validHO from "../../../../test/test-data/AnnotatedHO1.json"
import HO100239_1 from "../../../../test/test-data/HO100239_1.json"
import HO100239_2 from "../../../../test/test-data/HO100239_2.json"
import HO100102_1 from "../../../../test/test-data/HO100102_1.json"
import HO100239_3 from "../../../../test/test-data/HO100239_3.json"
import HO100203_1 from "../../../../test/test-data/HO100203_1.json"
import HO100200_1 from "../../../../test/test-data/HO100200_1.json"
import HO100209_1 from "../../../../test/test-data/HO100209_1.json"
import HO100200_2 from "../../../../test/test-data/HO100200_2.json"
import HO100247_1 from "../../../../test/test-data/HO100247_1.json"
import HO100247_2 from "../../../../test/test-data/HO100247_2.json"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

describe("isException", () => {
  it("Should return HO100302 when there is an ASN exception", () => {
    const dummyAho = parseAhoXml(HO100302_1.hearingOutcomeXml)

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber"
    )

    expect(result).toBe(ExceptionCode.HO100302)
  })

  it("Should return HO100239 when there is an Offence Reason Sequence exception", () => {
    const dummyAho = parseAhoXml(HO100239_1.hearingOutcomeXml)

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CriminalProsecutionReference.OffenceReasonSequence"
    )

    expect(result).toBe(ExceptionCode.HO100239)
  })

  it("Should correctly match paths when they access specific indexes in an array", () => {
    const dummyAho = parseAhoXml(HO100239_2.hearingOutcomeXml)

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[1].CriminalProsecutionReference.OffenceReasonSequence"
    )

    expect(result).toBe(ExceptionCode.HO100239)
  })

  it("Should return HO100102 when there is an invalid Next Hearing Date", () => {
    const dummyAho = parseAhoXml(HO100102_1.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].NextHearingDate"
    )

    expect(result).toBe(ExceptionCode.HO100102)
  })

  it("Should return HO100239 when there is an invalid Court Offence Sequence Number", () => {
    const dummyAho = parseAhoXml(HO100239_3.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtOffenceSequenceNumber"
    )

    expect(result).toBe(ExceptionCode.HO100239)
  })

  it("Should return HO100203 when there is an invalid Court Case Reference Number", () => {
    const dummyAho = parseAhoXml(HO100203_1.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber"
    )

    expect(result).toBe(ExceptionCode.HO100203)
  })

  it("Should return HO100200 when there is an invalid Force Owner", () => {
    const dummyAho = parseAhoXml(HO100200_1.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.OrganisationUnitCode"
    )

    expect(result).toBe(ExceptionCode.HO100200)
  })

  it("Should return HO100200 when there is an invalid Next Result Source Organisation", () => {
    const dummyAho = parseAhoXml(HO100200_2.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].NextResultSourceOrganisation.OrganisationUnitCode"
    )

    expect(result).toBe(ExceptionCode.HO100200)
  })

  it("Should return HO100209 when there is an invalid Court PNC Identifier", () => {
    const dummyAho = parseAhoXml(HO100209_1.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier"
    )

    expect(result).toBe(ExceptionCode.HO100209)
  })

  it("Should return HO100247 when there is an invalid Result Qualifier Code", () => {
    const dummyAho = parseAhoXml(HO100247_1.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable[0].Code"
    )

    expect(result).toBe(ExceptionCode.HO100247)
  })

  it("Should return HO100309 when there is the lookup fails for Result Qualifier Code", () => {
    const dummyAho = parseAhoXml(HO100247_2.hearingOutcomeXml) as AnnotatedHearingOutcome

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(
      dummyAho as AnnotatedHearingOutcome,
      "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable[0].Code"
    )

    expect(result).toBe(ExceptionCode.HO100309)
  })

  it("Should return null when object path is not in exceptions array", () => {
    const dummyAho = parseAhoXml(HO100302_1.hearingOutcomeXml)

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(1)

    const result = isException(dummyAho as AnnotatedHearingOutcome, "AnnotatedHearingOutcome.Random.Path")

    expect(result).toBe(null)
  })

  it("Should return null when there are no exceptions", () => {
    const dummyAho = parseAhoXml(validHO.hearingOutcomeXml)

    expect((dummyAho as AnnotatedHearingOutcome).Exceptions).toHaveLength(0)

    const result = isException(dummyAho as AnnotatedHearingOutcome, "AnnotatedHearingOutcome.Random.Path")

    expect(result).toBe(null)
  })
})
