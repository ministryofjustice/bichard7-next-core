const pinned = [
  "eslint-plugin",
  "eslint-plugin-cypress",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint-config-airbnb-typescript",
  "word-list",
  "react",
  "react-dom",
  "@types/react",
  "@types/react-dom",
  "next",
  "@next/eslint-plugin-next"
]
const ignored = ["eslint"]
const skipped = [{ package: "cypress-circleci-reporter", version: "0.4.0", reason: "Not compatible with Node v24" }]

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

  filterResults: (pkg, { upgradedVersion }, reason) => {
    if (ignored.some((ignore) => ignore.package === pkg)) {
      return false
    }
    const skippedItem = skipped.find((skip) => skip.package === pkg && skip.version === upgradedVersion)
    if (skippedItem) {
      console.log(`Skipping ${pkg} upgrade to ${upgradedVersion}: ${skippedItem.reason} (.ncurc.js)`)
      return false
    }
    return true
  }
}
