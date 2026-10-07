/*
  Pinned:
  - cookie
    - v2.0.0 contains breaking changes
  - cookies-next
    - v5 contains breaking changes
  - undici
    - v6 supports node v20. Higher versions need > node v20
  - cypress (pinning as we need to fix linting errors when upgrading)

  Ignored:
    - cypress-circleci-reporter
      - 0.4.0 changed to module type
    - raw-body
      - v4 breaks our CI
    - @swc/core (we are getting issues with the native binary in 1.16.13)
*/

const pinned = new Set(["cookie", "cookies-next", "undici", "cypress"])
const ignored = new Set(["cypress-circleci-reporter", "raw-body", "@swc/core"])

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
