import type { PncCase, PncQueryResult } from "src/types/PncQueryResult"
import createPNCCourtCase from "tests/helpers/generateMockPncCase"

import { createHOOffence, createPNCCourtCaseOffence } from "tests/helpers/generateMockOffences"
import matchCases from "./caseMatcher"

const createPNCMessage = (cases: PncCase[]): PncQueryResult => ({ cases } as PncQueryResult)

describe("caseMatcher", () => {
  it("testMatchNoActualMatchesNoNonMatchingExplicitMatchesNoCCRWithAllFinalResults", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2006-03-03"
      })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "XX13451", startDate: "03032006", sequenceNumber: 1 })
    ]

    const pncCases = [createPNCCourtCase("09/11FG/568235X", pncOffences)]
    const pncMessage = createPNCMessage(pncCases)

    const outcome = matchCases(hoOffences, pncMessage)

    expect(outcome.courtCaseMatches).toHaveLength(0)
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })
})

// @Test
//   public void testMatchNoActualMatchesNoNonMatchingExplicitMatchesNoCCRWithAllFinalResults()
//       throws Exception {
//     Offence[] hoOffences = {createHOOffence("VG24030", "2006-03-03", null)};
//     OffenceType[] pncOffences = {createPNCOffence("XX13451", "03032006", "001", null)};
//     CourtCaseType[] pncCases = {createPNCCourtCase("09/11FG/568235X", Arrays.asList(pncOffences))};
//     CXE01Element pncMessage = createPNCMessage(Arrays.asList(pncCases));
//     CaseMatcherOutcome outcome = caseMatcher.match(Arrays.asList(hoOffences), pncMessage);
//     assertEquals(0, outcome.getCourtCaseMatches().size());
//     assertEquals(0, outcome.getPenaltyCaseMatches().size());
//   }
