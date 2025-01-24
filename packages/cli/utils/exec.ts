import { exec as execCommand } from "child_process"

export function exec(command: string) {
  return new Promise((resolve, reject) => {
    execCommand(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      if (stderr) {
        reject(new Error(stderr))
      }
      resolve(stdout.trim())
    })
  })
}
