import { forces } from "@moj-bichard7-developers/bichard7-next-data"
import type { Case } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default (force: NonNullable<Case["ForceOwner"]>): string | null => {
  const forceCode = force.OrganisationUnitCode
  const forceName = forces.find((f) => f.code === force.SecondLevelCode)?.name
  return forceName ? `${forceName} ${forceCode}` : forceCode
}
