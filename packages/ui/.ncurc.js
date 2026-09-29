/*
  Pinned:
  - cookie
    - v2.0.0 contains breaking changes
  - cookies-next
    - v5 contains breaking changes
  - undici
    - v6 supports node v20. Higher versions need > node v20

  Ignored:
    - cypress-circleci-reporter
      - 0.4.0 changed to module type
    - raw-body
      - v4 breaks our CI
*/

const pinned = new Set(["cookie", "cookies-next", "undici"])
const ignored = new Set(["cypress-circleci-reporter", "raw-body"])

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
