import parsePncDate from "src/lib/parsePncDate"
import type { Offence, Result } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import matchOffencesWithSameOffenceCodeAndStartDate from "./matchOffencesWithSameOffenceCodeAndStartDate"

type CreateHoOffenceOptions = {
  actOrSource?: string
  year?: string
  reason?: string
  startDate: string
  endDate?: string
  resultCodes?: string[]
  offenceCategory?: string
  sequenceNumber?: number
  courtCaseReferenceNumber?: string
}

const createHOOffence = ({
  actOrSource = "VG",
  year = "24",
  reason = "030",
  startDate,
  endDate,
  resultCodes,
  offenceCategory,
  sequenceNumber,
  courtCaseReferenceNumber
}: CreateHoOffenceOptions): Offence => {
  const offence: Partial<Offence> = {
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: actOrSource,
          Year: year,
          Reason: reason,
          FullCode: `${actOrSource}${year}${reason}`
        }
      },
      OffenceReasonSequence: sequenceNumber
    },
    ActualOffenceStartDate: {
      StartDate: new Date(startDate)
    },
    Result: resultCodes?.map(
      (code): Result => ({
        CJSresultCode: parseInt(code, 10),
        SourceOrganisation: {
          SecondLevelCode: "01",
          ThirdLevelCode: "OK",
          BottomLevelCode: "00",
          OrganisationUnitCode: "01OK00"
        },
        ResultQualifierVariable: [{ Code: "A" }]
      })
    ),
    OffenceCategory: offenceCategory,
    CourtCaseReferenceNumber: courtCaseReferenceNumber
  }

  if (!!endDate) {
    offence.ActualOffenceEndDate = {
      EndDate: new Date(endDate)
    }
  }

  return offence as Offence
}

type CreatePNCCourtCaseOffenceOptions = {
  offenceCode: string
  startDate: string
  endDate?: string
  disposalCodes?: number[]
  sequenceNumber?: number
}

const createPNCCourtCaseOffence = ({
  offenceCode,
  startDate,
  endDate,
  disposalCodes,
  sequenceNumber = 1
}: CreatePNCCourtCaseOffenceOptions): PncOffence => {
  const offence: PncOffence = {
    offence: {
      acpoOffenceCode: offenceCode,
      cjsOffenceCode: offenceCode,
      startDate: parsePncDate(startDate),
      sequenceNumber
    }
  }

  if (endDate && endDate !== "") {
    offence.offence.endDate = parsePncDate(endDate)
  }

  if (disposalCodes) {
    offence.disposals = disposalCodes.map((disposalCode) => ({ type: disposalCode }))
  }

  return offence
}

describe("matchOffencesWithSameOffenceCodeAndStartDate()", () => {
  it("OneOfEachWithMatchingNonNullEndDatesPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      actOrSource: "VG",
      year: "24",
      reason: "030",
      startDate: "2009-09-08",
      endDate: "2010-10-10",
      resultCodes: ["1002"]
    })

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "10102010" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  it("OneOfEachWithMatchingNullEndDatesPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      actOrSource: "VG",
      year: "24",
      reason: "030",
      startDate: "2009-09-08",
      resultCodes: ["1002"]
    })

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  it("OneOfEachOnlyHOHasEndDatePNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      actOrSource: "VG",
      year: "24",
      reason: "030",
      startDate: "2009-09-08",
      endDate: "2010-10-10",
      resultCodes: ["1002"]
    })

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OneOfEachOnlyPNCHasEndDatePNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      actOrSource: "VG",
      year: "24",
      reason: "030",
      startDate: "2009-09-08",
      resultCodes: ["1002"]
    })

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "10102010" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OneOfEachBothHaveDifferentEndDatesPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      actOrSource: "VG",
      year: "24",
      reason: "030",
      startDate: "2009-09-08",
      endDate: "2010-04-04",
      resultCodes: ["1002"]
    })

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "10102010" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("TwoHOOffencesOneWithEndDateOnePNCOffenceWithNoEndDatePNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-04",
        resultCodes: ["1002"]
      })
    ]

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(hoOffences, [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[0], pncOffence }])
  })

  it("TwoHOOffencesOneWithEndDateOnePNCOffenceWithMatchingEndDatePNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-04",
        resultCodes: ["1002"]
      })
    ]

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "04042010" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(hoOffences, [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[1], pncOffence }])
  })

  it("TwoHOOffencesOneWithEndDateOnePNCOffenceWithNonMatchingEndDatePNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-04",
        resultCodes: ["1002"]
      })
    ]

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "04062010" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(hoOffences, [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("TwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithNoEndDatePNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-05",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-04",
        resultCodes: ["1002"]
      })
    ]

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(hoOffences, [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("TwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithEndDateMatchingFirstOnePNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-05",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-04",
        resultCodes: ["1002"]
      })
    ]

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "05042010" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(hoOffences, [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[0], pncOffence }])
  })

  it("TwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithEndDateMatchingSecondOnePNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-05",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-04",
        resultCodes: ["1002"]
      })
    ]

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "04042010" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(hoOffences, [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[1], pncOffence }])
  })

  it("TwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithEndDateMatchingNeitherPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-05",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "VG",
        year: "24",
        reason: "030",
        startDate: "2009-09-08",
        endDate: "2010-04-04",
        resultCodes: ["1002"]
      })
    ]

    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", endDate: "04042011" })

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(hoOffences, [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateOneOfEachBothHaveDifferentEndDatesPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "10102010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateOneOfEachOnlyHOHasEndDatePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-10-10", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateOneOfEachOnlyPNCHasEndDatePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "10102010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateOneOfEachWithMatchingNonNullEndDatesPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-10-10", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "10102010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(hoOffence.length, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateOneOfEachWithMatchingNullEndDatesPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(hoOffence.length, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateTwoHOOffencesOneWithEndDateOnePNCOffenceWithMatchingEndDatePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "04042010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[1]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateTwoHOOffencesOneWithEndDateOnePNCOffenceWithNoEndDatePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateTwoHOOffencesOneWithEndDateOnePNCOffenceWithNonMatchingEndDatePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", null, new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "04062010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateTwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithEndDateMatchingFirstOnePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-05", new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "05042010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[0]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateTwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithEndDateMatchingNeitherPNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-05", new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "04042011")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateTwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithEndDateMatchingSecondOnePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-05", new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "04042010")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(1, outcome.getMatchedOffences().size());
  //   assertSame(pncOffence[0], outcome.getMatchedOffences().get(hoOffence[1]));
  // }

  // @Test
  // public void
  //     testMatchOffencesWithSameOffenceCodeAndStartDateTwoHOOffencesWithDifferentEndDatesOnePNCOffenceWithNoEndDatePNCOffencesArePenaltyOnes()
  //         throws Exception {
  //   final List hoOffences = new ArrayList();
  //   HearingOutcomeStructure.CaseType.HearingDefendantType.Offence[] hoOffence = {
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-05", new String[] {"1002"}),
  //     createHOOffence("VG", "24", "030", "2009-09-08", "2010-04-04", new String[] {"1002"})
  //   };
  //   hoOffences.addAll(Arrays.asList(hoOffence));
  //   final List pncOffences = new ArrayList();
  //   uk.gov.ocjr.mtu.br7.xmlconverter.jaxb.objects.nspispnc.attributed.PenaltyCasesType
  //           .PenaltyCaseType.OffencesType.OffenceType[]
  //       pncOffence = {createPNCPenaltyCaseOffence("VG24030", "08092009", "")};
  //   pncOffences.addAll(Arrays.asList(pncOffence));
  //   OffenceMatcherOutcome outcome =
  //       offenceCodeMatcher.matchOffencesWithSameOffenceCodeAndStartDate(
  //           hoOffences, pncOffences, true);
  //   assertTrue(outcome.allPNCOffencesMatched());
  //   assertEquals(0, outcome.getDuplicateHOOffences().size());
  //   assertEquals(0, outcome.getMatchedOffences().size());
  // }
})
