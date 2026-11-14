import { forces } from "@moj-bichard7/standing-data"
import type { Case } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export default (force: NonNullable<Case["ForceOwner"]>): string | null => {
  const forceCode = force.OrganisationUnitCode
  const forceName = forces.find((f) => f.code === force.SecondLevelCode)?.name
  return forceName ? `${forceName} ${forceCode}` : forceCode
}
