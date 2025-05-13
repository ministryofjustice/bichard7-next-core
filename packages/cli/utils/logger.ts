import { appendFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

const logDirectory = "/tmp/email-logs"

if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory)
}

const getLogFilePath = () => {
  const today = new Date().toISOString().slice(0, 10)
  return join(logDirectory, `email-log-${today}.txt`)
}

export const logToFile = (message: string) => {
  const timestamp = new Date().toISOString()
  const logLine = `[${timestamp}] ${message}\n`
  appendFileSync(getLogFilePath(), logLine)
}
