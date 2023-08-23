import getFile from "phase1/comparison/lib/getFile"
import type { ComparisonLog } from "phase1/comparison/types"

export type FileLookup = {
  fileName: string
  contents?: string
}

const fetchFile = async (record: ComparisonLog, cache: boolean): Promise<FileLookup> => {
  const skip = !!record.skipped
  const s3Url = `s3://${process.env.COMPARISON_S3_BUCKET}/${record.s3Path}`
  if (skip) {
    return { fileName: s3Url }
  }
  const contents = await getFile(s3Url, cache)
  return { fileName: s3Url, contents }
}

export default fetchFile
