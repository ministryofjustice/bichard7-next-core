import fs from "fs"
import Poller from "../utils/Poller"

export const checkForFile = (directory: string, fileName: string) => {
  const dir = `./${directory}`
  const getDirContents = (): Promise<string[] | false> => Promise.resolve(fs.existsSync(dir) && fs.readdirSync(dir))

  const checkFileExists = (dirContents: string[] | false) => dirContents && dirContents.includes(fileName)

  const options = {
    timeout: 5000,
    delay: 100,
    name: "fs check for file",
    condition: checkFileExists
  }

  return new Poller<string[] | false>(getDirContents)
    .poll(options)
    .then(() => true)
    .catch((error) => error)
}
