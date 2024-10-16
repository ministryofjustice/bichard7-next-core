import type {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendAsn from "./amendAsn"

describe("asn amendments", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("applies valid asn amendments to aho", () => {
    amendAsn("1146AA0100000448754E", aho)
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CriminalProsecutionReference
        .DefendantOrOffender?.DefendantOrOffenderSequenceNumber
    ).toBe("00000448754")
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBe(
      "1146AA0100000448754E"
    )
  })

  it("applies valid asn amendments to multiple offences", () => {
    const dummyOffenceCopied = {
      ...dummyOffence,
      CriminalProsecutionReference: { DefendantOrOffender: { DefendantOrOffenderSequenceNumber: "00000448754" } }
    } as Offence

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [dummyOffenceCopied, dummyOffenceCopied]

    amendAsn("1146AA0100000448754E", aho) as unknown as AnnotatedHearingOutcome

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBe(
      "1146AA0100000448754E"
    )
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CriminalProsecutionReference
        .DefendantOrOffender?.DefendantOrOffenderSequenceNumber
    ).toBe("00000448754")
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[1].CriminalProsecutionReference
        .DefendantOrOffender?.DefendantOrOffenderSequenceNumber
    ).toBe("00000448754")
  })
})
