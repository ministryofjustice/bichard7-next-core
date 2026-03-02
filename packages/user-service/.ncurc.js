const pinned = ["word-list", "react", "react-dom", "@types/react", "@types/react-dom", "next", "govuk-frontend"]
const ignored = []
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
    if (ignored.some((ignore) => ignore.package === pkg)) {
      return false
    }
    if (skipped.some((skip) => skip.package === pkg && skip.version === upgradedVersion)) {
      return false
    }
    return true
  }
}
