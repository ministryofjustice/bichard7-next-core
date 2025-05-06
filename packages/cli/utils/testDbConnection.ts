import { exec } from "child_process"

const testDbConnection = async (hostname?: string) => {
  if (!hostname) {
    return false
  }

  return new Promise((resolve) => {
    exec(`pg_isready -h ${hostname} -p 5432`, (_, stdout, __) => {
      return resolve(stdout.includes("accepting connections"))
    })
  })
}

export default testDbConnection
