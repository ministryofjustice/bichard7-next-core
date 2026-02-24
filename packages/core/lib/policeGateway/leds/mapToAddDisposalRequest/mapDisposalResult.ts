import type { PncUpdateDisposal } from "../../../../phase3/types/HearingDetails"
import type { DisposalResult } from "../../../../types/leds/AddDisposalRequest"

import { parseDisposalQuantity } from "./parseDisposalQuantity"

const mapDisposalResult = (disposal: PncUpdateDisposal): DisposalResult => {
  const disposalQuantity = parseDisposalQuantity(disposal.disposalQuantity)
  const { disposalDuration, disposalEffectiveDate, amount } = disposalQuantity ?? {
    disposalDuration: undefined,
    disposalEffectiveDate: undefined,
    amount: 0
  }

  const disposalQualifiers = disposal.disposalQualifiers
    ?.match(/.{1,2}/g)
    ?.map((q) => q.trim())
    .filter(Boolean)

  return {
    disposalCode: Number(disposal.disposalType),
    disposalQualifiers,
    disposalText: disposal.disposalText || undefined,
    disposalDuration,
    disposalEffectiveDate,
    ...(amount && { disposalFine: { amount } })
  }
}

export default mapDisposalResult
