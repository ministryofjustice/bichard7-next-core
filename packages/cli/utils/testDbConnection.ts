import { exec, execSync } from "child_process"
import { red, green, bold } from "cli-color"

const isPostgresInstalled = (): boolean => {
  try {
    execSync("which psql", { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}

const testDbConnection = (hostname?: string) => {
  const checkPostgresInstalled = isPostgresInstalled()

  if (!checkPostgresInstalled) {
    console.log(red("You need to install the postgress cli tool\n"))
    console.log(`Run ${bold(green("brew install postgresql"))} to install.`)
    process.exit(1)
  }

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
