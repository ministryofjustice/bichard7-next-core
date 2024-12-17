/*
  Pinned:
  - styled-components
    - Conflict with GDS9
  - cookies-next
    - v5 contains breaking changes
  - react, react-dom, @types/react, @types/react-dom
    - Contains breaking changes
    - govuk-react only on react 18


  Skipped:
  - next
    - 13.4.13 causes failures with fetch
*/
const pinned = ["styled-components", "cookies-next", "react", "react-dom", "@types/react", "@types/react-dom"]
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
