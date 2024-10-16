/*
  Pinned:
  - styled-components
    - Conflict with GDS
  - @typescript-eslint/eslint-plugin
    - Another package does not yet support the latest version
  - @typescript-eslint/parser
    - Another package does not yet support the latest version


  Skipped:
  - next
    - 13.4.13 causes failures with fetch
*/
const pinned = ["styled-components", "eslint", "@typescript-eslint/parser"]
const ignored = []
const skipped = [{ package: "next", version: "13.4.13" }]

module.exports = {
  target: (pkg) => {
    if (pinned.some((pin) => pin === pkg)) {
      const res = "minor"
      console.log(` ${pkg} is pinned to ${res} upgrades only (.ncurc.js)`)
      return res
    }
    return "latest"
  },

  filterResults: (pkg, { upgradedVersion }) => {
    if (ignored.some((ignore) => ignore.pkg === pkg)) {
      return false
    }
    if (skipped.some((skip) => skip.pkg === pkg && skip.version === upgradedVersion)) {
      return false
    }
    return true
  }
}
