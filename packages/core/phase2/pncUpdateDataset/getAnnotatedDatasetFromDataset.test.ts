import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import getAnnotatedDatasetFromDataset from "./getAnnotatedDatasetFromDataset"

describe("getAnnotatedDatasetFromDataset", () => {
  it("should return the pncUpdateDataset wrapped in annotated PNC update dataset", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    const result = getAnnotatedDatasetFromDataset(pncUpdateDataset)

    expect(result.AnnotatedPNCUpdateDataset.PNCUpdateDataset).toEqual(pncUpdateDataset)
  })
})
