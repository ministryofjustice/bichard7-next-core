process.env.NODE_ENV = "test"

import getArgs from "./getArgs"
import processFile from "./processFile"

const main = async () => {
  const args = getArgs()
  if ("file" in args && args.file) {
    await processFile(args.file)
  }
}

export default main
