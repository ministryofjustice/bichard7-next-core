// ncu updates all the bichard7-next-data packages
// to the latest version, which is decidedly unhelpful
const semver = new RegExp(
  /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/
) // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const pinned = []
const ignored = [`bichard7-next-data-(${semver.source})`]

module.exports = {
  target: (package) => {
    if (pinned.some((p) => new RegExp(`^${p}$`).test(package))) {
      const res = "minor"
      console.log(` ${package} is pinned to ${res} upgrades only (.ncurc.js)`)
      return res
    }
    return "latest"
  },

  filterResults: (package) => {
    if (ignored.some((p) => new RegExp(`^${p}$`).test(package))) {
      return
    }
    return true
  }
}
