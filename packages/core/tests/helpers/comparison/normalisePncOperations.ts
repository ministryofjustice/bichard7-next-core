import type PoliceUpdateRequest from "../../../phase3/types/PoliceUpdateRequest"

const normalisePncOperations = (operations: PoliceUpdateRequest[]) => {
  for (const operation of operations) {
    if (operation.request) {
      for (const value of Object.values(operation.request)) {
        if (Array.isArray(value)) {
          for (const item of value) {
            for (const [subfield, subvalue] of Object.entries(item)) {
              if (!subvalue) {
                delete (item as unknown as Record<string, unknown>)[subfield]
              }
            }
          }
        }
      }
    }
  }
}

export default normalisePncOperations
