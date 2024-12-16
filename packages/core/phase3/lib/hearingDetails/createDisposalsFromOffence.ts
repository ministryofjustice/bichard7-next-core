import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import type { Disposal } from "../../types/HearingDetails"

import { HearingDetailsType } from "../../types/HearingDetails"
import createPncDisposalFromOffence from "../createPncDisposalFromOffence"

export const createDisposalsFromOffence = (aho: AnnotatedHearingOutcome, offence: Offence): Disposal[] =>
  createPncDisposalFromOffence(aho, offence).map((disposal) => ({
    disposalType: disposal.type?.toString() ?? "",
    disposalQuantity: disposal.qtyUnitsFined ?? "",
    disposalQualifiers: disposal.qualifiers ?? "",
    disposalText: disposal.text ?? "",
    type: HearingDetailsType.DISPOSAL
  }))
