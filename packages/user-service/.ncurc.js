const pinned = [
  "eslint",
  "eslint-plugin",
  "eslint-plugin-cypress",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint-config-airbnb-typescript",
  "word-list",
  "react",
  "react-dom",
  "@types/react",
  "@types/react-dom"
]
const ignored = []
const skipped = []

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
    if (ignored.some((ignore) => ignore.package === pkg)) {
      return false
    }
    if (skipped.some((skip) => skip.package === pkg && skip.version === upgradedVersion)) {
      return false
    }
    return true
  }
}
