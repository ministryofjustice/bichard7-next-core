import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import generateCourtNameTypes from "./generateCourtNameTypes"

const UNDATED_WARRANT_ISSUED_CODE = 4576
const DATED_WARRANT_ISSUED_CODE = 4575
const UNKNOWN_COURT_CODE = "0000"
const FAILED_TO_APPEAR_COURT_CODE = "9998"

describe("generateCourtNameTypes", () => {
  it.each([
    {
      should: "empty strings",
      when: "PSA court and remand court are unknown and warrant is not issued",
      psaCourtCode: UNKNOWN_COURT_CODE,
      remandCourtCode: UNKNOWN_COURT_CODE,
      resultCode: 2565,
      expectedCourtNameType1: "",
      expectedCourtNameType2: ""
    },
    {
      should: "empty string for court name 1 and only court house name for court name 2",
      when: "defendant failed to appear at PSA court, remand court is unknown, and undated warrant is issued",
      psaCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      remandCourtCode: UNKNOWN_COURT_CODE,
      resultCode: UNDATED_WARRANT_ISSUED_CODE,
      expectedCourtNameType1: "",
      expectedCourtNameType2: "Dummy court house name"
    },
    {
      should: "court house name and type for both court names",
      when: "defendant failed to appear at PSA court and remand court, and warrant is not issued",
      psaCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      remandCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      resultCode: 2565,
      expectedCourtNameType1: "Dummy court house name Dummy court type",
      expectedCourtNameType2: "Dummy court house name Dummy court type"
    },
    {
      should: "court house name and type for both court names",
      when: "defendant failed to appear at remand court, PSA court is unknown, and warrant is not issued",
      psaCourtCode: UNKNOWN_COURT_CODE,
      remandCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      resultCode: 2565,
      expectedCourtNameType1: "Dummy court house name Dummy court type",
      expectedCourtNameType2: "Dummy court house name Dummy court type"
    },
    {
      should: "empty string for court name 2 and only court house name for court name 1",
      when: "defendant failed to appear at remand court, PSA court is unknown, and dated warrant is issued",
      psaCourtCode: UNKNOWN_COURT_CODE,
      remandCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      resultCode: DATED_WARRANT_ISSUED_CODE,
      expectedCourtNameType1: "Dummy court house name",
      expectedCourtNameType2: ""
    },
    {
      should: "court house name and type for court name 1 and only court house name for court name 2",
      when: "defendant failed to appear at PSA court and remand court, and undated warrant is issued",
      psaCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      remandCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      resultCode: UNDATED_WARRANT_ISSUED_CODE,
      expectedCourtNameType1: "Dummy court house name Dummy court type",
      expectedCourtNameType2: "Dummy court house name"
    },
    {
      should: "court house name and type for both court names",
      when: "defendant failed to appear at PSA court, remand court is unknown, and warrant is not issued",
      psaCourtCode: FAILED_TO_APPEAR_COURT_CODE,
      remandCourtCode: UNKNOWN_COURT_CODE,
      resultCode: 2565,
      expectedCourtNameType1: "Dummy court house name Dummy court type",
      expectedCourtNameType2: "Dummy court house name Dummy court type"
    }
  ])(
    "should return $should when $when",
    ({ psaCourtCode, remandCourtCode, resultCode, expectedCourtNameType1, expectedCourtNameType2 }) => {
      const results = [{ CJSresultCode: resultCode }] as Result[]
      const [courtNameType1, courtNameType2] = generateCourtNameTypes(
        psaCourtCode,
        remandCourtCode,
        "Dummy court type",
        "Dummy court house name",
        results
      )

      expect(courtNameType1).toBe(expectedCourtNameType1)
      expect(courtNameType2).toBe(expectedCourtNameType2)
    }
  )
})
