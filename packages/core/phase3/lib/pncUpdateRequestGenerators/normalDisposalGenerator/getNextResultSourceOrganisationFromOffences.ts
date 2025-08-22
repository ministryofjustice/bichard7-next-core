import type { Offence, OrganisationUnitCodes } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const getNextResultSourceOrganisationFromOffences = (offences: Offence[]): OrganisationUnitCodes | undefined =>
  offences
    .flatMap((offence) => offence.Result)
    .find((result) => result.NextResultSourceOrganisation && result.PNCDisposalType === 2059)
    ?.NextResultSourceOrganisation ?? undefined

export default getNextResultSourceOrganisationFromOffences
