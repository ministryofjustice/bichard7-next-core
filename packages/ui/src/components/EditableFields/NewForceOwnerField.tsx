import ForceOwnerTypeahead from "../ForceOwnerTypeahead"
import { useState } from "react"
import ForceOwnerApiResponse from "../../types/ForceOwnerApiResponse"

export const NewForceOwnerField = ({}) => {
  const [forceCodes, setForceOwners] = useState<ForceOwnerApiResponse>([])

  let forceOwnerToDisplay = undefined

  if (forceCodes.length == 1) {
    forceOwnerToDisplay = forceCodes[0].forceCode + " - " + forceCodes[0].forceName
  }

  return <ForceOwnerTypeahead value={forceOwnerToDisplay} setForceOwners={setForceOwners} />
}
