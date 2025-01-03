import fs from "fs"

const getFixture = (path: string, correlationId: string): string =>
  String(fs.readFileSync(path)).replace("CORRELATION_ID", correlationId)

export default getFixture
