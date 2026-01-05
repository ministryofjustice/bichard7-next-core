import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import sample from "lodash.sample"

export default (): ResolutionStatus => {
  const choices: ResolutionStatus[] = [ResolutionStatus.Unresolved, ResolutionStatus.Resolved]
  return sample(choices) || ResolutionStatus.Unresolved
}
