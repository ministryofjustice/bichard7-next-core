/*
  Pinned:
  - cookies-next
    - v5 contains breaking changes
  - react, react-dom - v19.1 +
    - Has breaking changes. Need to look into this more.

*/
const pinned = ["cookies-next"]
const ignored = ["react", "react-dom"]
const skipped = [{ package: "next", version: "13.4.13" }]

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
