import sample from "lodash.sample"
import type { ResolutionStatus } from "../../src/types/ResolutionStatus"

export default (): ResolutionStatus => {
  const choices: ResolutionStatus[] = ["Unresolved", "Resolved"]
  return sample(choices) || "Unresolved"
}
