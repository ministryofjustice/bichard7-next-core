import type { Exception } from "types/exceptions"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

const nextHearingLocationExceptions = [ExceptionCode.HO100200, ExceptionCode.HO100300, ExceptionCode.HO100322]

const filterNextHearingLocationException = (exceptions: Exception[]) =>
  exceptions.filter(
    (exception) =>
      exception.path.join(".").endsWith(".NextResultSourceOrganisation.OrganisationUnitCode") &&
      nextHearingLocationExceptions.includes(exception.code)
  )

const hasNextHearingLocationException = (exceptions: Exception[]) =>
  filterNextHearingLocationException(exceptions).length > 0

export { filterNextHearingLocationException }
export default hasNextHearingLocationException
