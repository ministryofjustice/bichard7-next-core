import type { PncUpdateDisposal } from "../../../../phase3/types/HearingDetails"
import type { DisposalResult } from "../../../../types/leds/AddDisposalRequest"

import { DISPOSAL_QUALIFIERS_FIELD_LENGTH } from "../../../results/createPoliceDisposalsFromResult/createPoliceDisposal"
import { parseDisposalDuration } from "./parseDisposalDuration"
import { parseDisposalQuantity } from "./parseDisposalQuantity"

const mapDisposalResult = (disposal: PncUpdateDisposal): DisposalResult => {
  const { disposalDuration, disposalEffectiveDate, amount } = parseDisposalQuantity(disposal.disposalQuantity) ?? {}

  const disposalQualifiers =
    disposal.disposalQualifiers
      .slice(0, DISPOSAL_QUALIFIERS_FIELD_LENGTH - 4)
      ?.match(/.{1,2}/g)
      ?.map((q) => q.trim())
      .filter(Boolean) ?? []
  const disposalQualifierDuration = parseDisposalDuration(
    disposal.disposalQualifiers.slice(DISPOSAL_QUALIFIERS_FIELD_LENGTH - 4)?.trim()
  )

  return {
    disposalCode: Number(disposal.disposalType),
    disposalQualifiers,
    disposalText: disposal.disposalText || undefined,
    disposalDuration,
    disposalQualifierDuration,
    disposalEffectiveDate,
    ...(amount && { disposalFine: { amount } })
  }
}

export default mapDisposalResult
