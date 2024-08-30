import { isEmpty } from "lodash"
import { Amendments } from "types/Amendments"
import { Exception } from "../../types/exceptions"
import { filterNextHearingLocationException } from "./hasNextHearingLocationException"

const isNextHearingLocationAmended = (
  exceptions: Exception[],
  nextSourceOrganisation: Amendments["nextSourceOrganisation"]
): boolean => {
  const nextHearingLocationException = filterNextHearingLocationException(exceptions)
  if (!nextHearingLocationException.length) {
    return false
  }

  const updatedNextSourceOrganisation = nextSourceOrganisation || []

  return !isEmpty(updatedNextSourceOrganisation) && updatedNextSourceOrganisation.some((el) => el.value?.trim())
}

export default isNextHearingLocationAmended
