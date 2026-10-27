const pinned = new Set(["cookie", "word-list", "cypress"])
const ignored = new Set(["raw-body", "@swc/core"])

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
