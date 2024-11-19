import fs from "fs"

import Poller from "../utils/Poller"

export const checkForFile = (directory: string, fileName: string) => {
  const dir = `./${directory}`
  const getDirContents = (): Promise<false | string[]> => Promise.resolve(fs.existsSync(dir) && fs.readdirSync(dir))

  const checkFileExists = (dirContents: false | string[]) => dirContents && dirContents.includes(fileName)

  const options = {
    condition: checkFileExists,
    delay: 100,
    name: "fs check for file",
    timeout: 5000
  }

  return new Poller<false | string[]>(getDirContents)
    .poll(options)
    .then(() => true)
    .catch((error) => error)
}
