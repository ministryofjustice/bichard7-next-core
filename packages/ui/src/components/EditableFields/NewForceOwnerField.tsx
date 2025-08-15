import ForceOwnerTypeahead from "../ForceOwnerTypeahead"
import { useState } from "react"
import ForceOwnerApiResponse from "../../types/ForceOwnerApiResponse"
//import { getForceCode, getForceName } from "../../services/searchForceOwners"
//import { forces } from "@moj-bichard7-developers/bichard7-next-data"
//import ResultClass from "@moj-bichard7/core/types/ResultClass"
//import getNextHearingLocationValue from "../../utils/amendments/getAmendmentValues/getNextHearingLocationValue"
//import { Result } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

interface NewForceOwnerFieldProps {
  //result: Result
  result: string
}

export const NewForceOwnerField = (
  {
    //result
  }: NewForceOwnerFieldProps
) => {
  // const { courtCase } = useCourtCase()
  //const currentForce = forces.find((force) => force.code === courtCase.orgForPoliceFilter?.substring(0, 2))
  // const forcesForReallocation = getForcesForReallocation(currentForce?.code)
  const [forceCodes, setForceOwners] = useState<ForceOwnerApiResponse>([])

  return (
    <ForceOwnerTypeahead
      value={forceCodes.length == 1 ? forceCodes[0].forceCode : undefined}
      setForceOwners={setForceOwners}
    />
  )
}
