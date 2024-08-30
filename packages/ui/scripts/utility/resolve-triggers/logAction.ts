import fs from "fs"

export default function logAction(courtCaseId: number | null, text: string, error?: Error) {
  let message = `${new Date().toISOString()}: `

  if (courtCaseId) {
    message += `Court Case (${courtCaseId}) - `
  }

  message += `${text}\n`

  if (error && Object.keys(error).length > 0) {
    message += JSON.stringify(error) + "\n"
  }

  console.log(message)
  fs.appendFileSync(`${__dirname}/${process.env.WORKSPACE}-actions.log`, message)
}
