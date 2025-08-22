import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

const generatePncUpdatedLogAttributes = (pncOperations: Operation[]) => ({
  "Operation Code": pncOperations[pncOperations.length - 1].code,
  "Number of Operations": pncOperations.length
})

export default generatePncUpdatedLogAttributes
