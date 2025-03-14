import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

import generateMockPhase1Result from "../../phase1/tests/helpers/generateMockPhase1Result"
import generateMockPhase2Result from "../../phase2/tests/helpers/generateMockPhase2Result"
import { PncOperation } from "../../types/PncOperation"
import errorPaths from "../exceptions/errorPaths"
import convertResultToErrorListRecord from "./convertResultToErrorListRecord"

describe("convertResultToErrorListRecord", () => {
  describe("Phase1", () => {
    it("should generate the error list record", () => {
      const phase1Result = generateMockPhase1Result({
        triggers: [{ code: TriggerCode.TRPR0001 }],
        hearingOutcome: { Exceptions: [{ code: ExceptionCode.HO100100, path: errorPaths.case.asn }] }
      })
      const convertedResult = convertResultToErrorListRecord(phase1Result)
      expect(convertedResult).toMatchSnapshot({
        trigger_insert_ts: expect.any(Date),
        msg_received_ts: expect.any(Date),
        error_insert_ts: expect.any(Date),
        create_ts: expect.any(Date),
        annotated_msg: expect.any(String),
        updated_msg: expect.any(String),
        message_id: expect.any(String)
      })
    })

    it("should truncate columns for the database", () => {
      const phase1Result = generateMockPhase1Result({
        triggers: [{ code: TriggerCode.TRPR0001 }],
        hearingOutcome: { Exceptions: [{ code: ExceptionCode.HO100100, path: errorPaths.case.asn }] }
      })

      const caseElem = phase1Result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
      const hearing = phase1Result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

      caseElem.HearingDefendant.DefendantDetail!.PersonName!.FamilyName = "X".repeat(501)
      caseElem.HearingDefendant.ArrestSummonsNumber = "X".repeat(22)
      hearing.CourtHearingLocation.OrganisationUnitCode = "X".repeat(8)
      caseElem.PTIURN = "X".repeat(12)
      hearing.CourtHouseName = "X".repeat(501)

      const convertedResult = convertResultToErrorListRecord(phase1Result)
      expect(convertedResult.defendant_name?.length).toBe(500)
      expect(convertedResult.asn?.length).toBe(21)
      expect(convertedResult.court_code?.length).toBe(7)
      expect(convertedResult.ptiurn?.length).toBe(11)
      expect(convertedResult.court_name?.length).toBe(500)
    })

    it("if defendant is corporate, defendant name should be OrganisationName", () => {
      const phase1Result = generateMockPhase1Result()

      const defendantElem = phase1Result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

      delete defendantElem.DefendantDetail
      defendantElem.OrganisationName = "Organisation Name"

      const convertedResult = convertResultToErrorListRecord(phase1Result)
      expect(convertedResult.defendant_name).toBe("Organisation Name")
    })

    it("if defendant is person, defendant name should be FamilyName GivenName", () => {
      const phase1Result = generateMockPhase1Result()

      const defendant = phase1Result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
      defendant.DefendantDetail = {
        Gender: 1,
        PersonName: {
          Title: "Mr",
          GivenName: ["TEST"],
          FamilyName: "TESTERSON"
        }
      }

      const errorListRecord = convertResultToErrorListRecord(phase1Result)
      expect(errorListRecord.defendant_name).toBe("TESTERSON TEST")
    })
  })

  describe("Phase2", () => {
    it("should generate the error list record", () => {
      const phase2Result = generateMockPhase2Result({
        triggers: [{ code: TriggerCode.TRPS0002 }],
        outputMessage: {
          Exceptions: [{ code: ExceptionCode.HO200100, path: errorPaths.case.asn }],
          PncOperations: [{ code: PncOperation.SENTENCE_DEFERRED, status: "NotAttempted" }]
        } as PncUpdateDataset
      })
      const convertedResult = convertResultToErrorListRecord(phase2Result)
      expect(convertedResult).toMatchSnapshot({
        trigger_insert_ts: expect.any(Date),
        msg_received_ts: expect.any(Date),
        error_insert_ts: expect.any(Date),
        create_ts: expect.any(Date),
        annotated_msg: expect.any(String),
        updated_msg: expect.any(String),
        message_id: expect.any(String)
      })
    })
  })
})
