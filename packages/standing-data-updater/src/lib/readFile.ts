import fs from "node:fs/promises"
import path from "node:path"

export const readFile = async <T>(filepath: string): Promise<T> => {
  const fileContents = await fs.readFile(path.resolve(__dirname, filepath), "utf8")
  return JSON.parse(fileContents.toString()) as T
}
