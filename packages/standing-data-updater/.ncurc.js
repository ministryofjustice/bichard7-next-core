// google packages are here because upgrading them
// currently breaks their compatibility
// affects: src/requested-changes-download/sheetsClient.ts
const pinned = new Set(["google-auth-library", "jest"])
const ignored = new Set(["googleapis", "puppeteer"])

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
