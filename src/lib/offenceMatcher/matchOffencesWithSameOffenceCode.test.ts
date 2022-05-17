import { createHOOffence, createPNCCourtCaseOffence } from "tests/helpers/generateMockOffences"
import matchOffencesWithSameOffenceCode from "./matchOffencesWithSameOffenceCode"

describe("matchOffencesWithSameOffenceCode()", () => {
  it("MorePNCOffencesPNCOffencesAreCourtOnes", () => {
    const pncOffence = createPNCCourtCaseOffence({ startDate: "08092009", endDate: "10102010" })
    const outcome = matchOffencesWithSameOffenceCode([], [pncOffence], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("NoPNCOffencesPNCOffencesAreCourtOnes", () => {
    const outcome = matchOffencesWithSameOffenceCode([], [], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("FewerPNCOffencesPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({ startDate: "2009-09-08" })
    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OneOfEachMatchingExactlyPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      startDate: "2009-09-09"
    })

    const pncOffence = createPNCCourtCaseOffence({ startDate: "09092009" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  it.skip("OneOfEachMatchingApproximatelyPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      startDate: "2009-09-10",
      endDate: "2010-10-10"
    })

    const pncOffence = createPNCCourtCaseOffence({ startDate: "09092009", endDate: "10102010" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOneOfEachMatchingApproximatelyPNCOffencesAreCourtOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-10", "2010-10-10", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   CourtCasesType.CourtCaseType.OffencesType.OffenceType[] pncOffence = {
  //     createPNCCourtCaseOffence("VG24030", "09092009", "10102010")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void testMatchOffencesWithSameOffenceCodeOneOfEachNotMatchingPNCOffencesAreCourtOnes()
  //     throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   CourtCasesType.CourtCaseType.OffencesType.OffenceType[] pncOffence = {
  //     createPNCCourtCaseOffence("VG24030", "09092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeTwoOfEachBothPNCsExactlyMatchSameHOPNCOffencesAreCourtOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-05-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   CourtCasesType.CourtCaseType.OffencesType.OffenceType[] pncOffence = {
  //     createPNCCourtCaseOffence("VG24030", "08092009", ""),
  //     createPNCCourtCaseOffence("VG24030", "08092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, false);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertEquals(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOnePNCExactlyMatchingTwoHOsWithDifferentResultsPNCOffencesAreCourtOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1003"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   CourtCasesType.CourtCaseType.OffencesType.OffenceType[] pncOffence = {
  //     createPNCCourtCaseOffence("VG24030", "08092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(2, outcome.getDuplicateHOOffences().size());
  //   for (int i = 0; i < hoOffence.length; i++) {
  //     assertTrue(outcome.getDuplicateHOOffences().contains(hoOffence[i]));
  //   }
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOnePNCExactlyMatchingTwoHOsWithSameResultsPNCOffencesAreCourtOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   CourtCasesType.CourtCaseType.OffencesType.OffenceType[] pncOffence = {
  //     createPNCCourtCaseOffence("VG24030", "08092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, false);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOnePNCApproximatelyMatchingTwoHOsPNCOffencesAreCourtOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   CourtCasesType.CourtCaseType.OffencesType.OffenceType[] pncOffence = {
  //     createPNCCourtCaseOffence("VG24030", "03092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeFourOffencesOnEachWithDifferentStartDatesInDifferentOrderPNCOffencesAreCourtOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-15", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-22", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-29", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   CourtCasesType.CourtCaseType.OffencesType.OffenceType[] pncOffence = {
  //     createPNCCourtCaseOffence("VG24030", "29092009", ""),
  //     createPNCCourtCaseOffence("VG24030", "22092009", ""),
  //     createPNCCourtCaseOffence("VG24030", "15092009", ""),
  //     createPNCCourtCaseOffence("VG24030", "08092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(4, outcome.getMatchedOffences().size());
  //   for (int i = 0; i < hoOffence.length; i++) {
  //     assertSame(pncOffence[3 - i], outcome.getMatchedOffences().get(hoOffence[i]));
  //   }
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeFourOffencesOnEachWithDifferentStartDatesInDifferentOrderPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-15", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-22", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-29", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {
  //     createPNCPenaltyCaseOffence("VG24030", "29092009", ""),
  //     createPNCPenaltyCaseOffence("VG24030", "22092009", ""),
  //     createPNCPenaltyCaseOffence("VG24030", "15092009", ""),
  //     createPNCPenaltyCaseOffence("VG24030", "08092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(4, outcome.getMatchedOffences().size());
  //   for (int i = 0; i < hoOffence.length; i++) {
  //     assertSame(pncOffence[3 - i], outcome.getMatchedOffences().get(hoOffence[i]));
  //   }
  // }

  // @Test
  // public void testMatchOffencesWithSameOffenceCodeMorePNCOffencesPNCOffencesArePenaltyOnes()
  //     throws Exception {
  //   final List hoOffences = new ArrayList();
  //   final List pncOffences = new ArrayList();
  //   pncOffences.add("");
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void testMatchOffencesWithSameOffenceCodeNoPNCOffencesPNCOffencesArePenaltyOnes()
  //     throws Exception {
  //   final List hoOffences = new ArrayList();
  //   final List pncOffences = new ArrayList();
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOneOfEachMatchingApproximatelyPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-10", "2010-10-10", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "09092009", "10102010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOneOfEachMatchingExactlyPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-09", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "09092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void testMatchOffencesWithSameOffenceCodeOneOfEachNotMatchingPNCOffencesArePenaltyOnes()
  //     throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "09092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOnePNCApproximatelyMatchingTwoHOsPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "03092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOnePNCExactlyMatchingTwoHOsWithDifferentResultsPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1003"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(2, outcome.getDuplicateHOOffences().size());
  //   for (int i = 0; i < hoOffence.length; i++) {
  //     assertTrue(outcome.getDuplicateHOOffences().contains(hoOffence[i]));
  //   }
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeOnePNCExactlyMatchingTwoHOsWithSameResultsPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, false);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeTwoOfEachBothPNCsExactlyMatchSameHOPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-05-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {
  //     createPNCPenaltyCaseOffence("VG24030", "08092009", ""),
  //     createPNCPenaltyCaseOffence("VG24030", "08092009", "")
  //   };
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCode(hoOffences, pncOffences, false);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertEquals(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }
})
