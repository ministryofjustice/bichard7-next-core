import fs from "node:fs/promises"
import path from "node:path"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import type { OffenceCode } from "../types/OffenceCode"
import type { PromiseResult } from "../types/Result"
import type { PnldFile } from "./PnldFileDownloader"
import { convertXml } from "./convertXml"
import { fileExists } from "../lib/fileExists"

const execFilePromise = promisify(execFile)

type OffenceCodeMap = {
  [index: string]: OffenceCode
}

const unzipFile = async (file: PnldFile, outDir: string): PromiseResult<void> => {
  if (!file.fileName) {
    throw new Error("Filename is missing")
  }

  const absoluteFilePath = path.resolve(file.fileName)
  const absoluteOutDir = path.resolve(outDir)

  if (await fileExists(absoluteOutDir)) {
    await fs.rm(absoluteOutDir, { recursive: true })
  }

  await fs.mkdir(absoluteOutDir, { recursive: true })

  await execFilePromise("unzip", ["-q", absoluteFilePath, "-d", absoluteOutDir])
}

const getAllFiles = async (startDir: string): Promise<string[]> => {
  const output = []
  const contents = await fs.readdir(startDir)
  for (const file of contents) {
    const fullFile = `${startDir}/${file}`
    if (file.endsWith(".xml")) {
      output.push(fullFile)
    }

    const fileStat = await fs.stat(fullFile)
    if (fileStat.isDirectory()) {
      const subDirFiles = await getAllFiles(fullFile)
      for (const subFile of subDirFiles) {
        output.push(subFile)
      }
    }
  }

  return output
}

const processZip = async (file: PnldFile, output: OffenceCodeMap): Promise<void> => {
  if (!file.fileName) {
    throw new Error("File name is missing")
  }

  const outDir = file.fileName.replace(".zip", "")
  await unzipFile(file, outDir)
  const xmlFiles = await getAllFiles(outDir)
  for (const xmlFile of xmlFiles) {
    const xmlData = await fs.readFile(xmlFile)
    try {
      const record = convertXml(xmlData.toString())

      output[record.cjsCode] = record
    } catch (e) {
      console.error("Error processing: ", xmlFile)
      throw e
    }
  }
}

export const processPnldFiles = async (files: PnldFile[]): Promise<OffenceCode[]> => {
  const output: OffenceCodeMap = {}
  for (const file of files.reverse()) {
    await processZip(file, output)
  }

  return Object.values(output)
}
