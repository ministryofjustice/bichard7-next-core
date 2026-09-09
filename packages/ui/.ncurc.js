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

const pinned = ["cookie", "cookies-next", "undici"]
const ignored = ["cypress-circleci-reporter", "raw-body"]
const skipped = []

module.exports = {
  filter: (pkg) => {
    if (ignored.some((ignore) => ignore === pkg)) {
      return false
    }

    return true
  },

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
