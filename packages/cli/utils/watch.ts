import { spawn } from "child_process"

export function watch(command: string, n = 5) {
  const watch = spawn("watch", [`-n ${n}`, `"${command}"`], { shell: true })
  watch.stdout.on("data", (data) => {
    process.stdout.write(data)
  })

  watch.stderr.on("data", (data) => {
    process.stderr.write(data)
  })

  watch.on("close", (code) => {
    console.log(`Watch process exited with code ${code}`)
  })

  watch.on("error", (err) => {
    throw err
  })
}
