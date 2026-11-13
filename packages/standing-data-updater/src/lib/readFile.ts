import fs from "node:fs/promises"

export const readFile = async <T>(filepath: string): Promise<T> => {
  const fileContents = await fs.readFile(filepath, "utf8")
  return JSON.parse(fileContents.toString()) as T
}
