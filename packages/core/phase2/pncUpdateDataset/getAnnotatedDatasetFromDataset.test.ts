import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import getAnnotatedDatasetFromDataset from "./getAnnotatedDatasetFromDataset"

describe("getAnnotatedDatasetFromDataset", () => {
  it("returns an annotated dataset containing the pncUpdateDataset", () => {
    const updateDataset = jest.fn()
    const annotatedDataset = getAnnotatedDatasetFromDataset(updateDataset as unknown as PncUpdateDataset)

    expect(annotatedDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset).toEqual(updateDataset)
  })
})
