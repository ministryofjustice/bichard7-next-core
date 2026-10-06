/*
  Pinned:
  - @inquirer/prompts
    - Breaks when using the latest 
*/

const pinned = new Set(["@inquirer/prompts"])
const ignored = new Set([])

module.exports = {
  target: (pkg) => {
    if (pinned.has(pkg)) {
      console.log(` ${pkg} is pinned to minor upgrades only (.ncurc.js)`)
      return "minor"
    }
    return "latest"
  },
  reject: (pkg) => {
    return ignored.has(pkg)
  }
}
