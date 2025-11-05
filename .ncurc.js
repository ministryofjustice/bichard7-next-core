const semver = new RegExp(
  /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/
) // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string

/*
  Pinned:
  - chalk
    - v5 is a breaking change
  - @types/diff
    - changed the Change type to require extra values
  - @faker-js/faker
    - v10 has breaking change with Jest

  Ignored:
  - bichard7-next-data-x.x.x
    - ncu updates all of them to the latest version, very unhelpful
  - p-limit
  - esbuild
    - ignored at v0.18.16 because v0.18.17 doesn't run the postinstall script properly.
  - @cucumber/cucumber
    - from tests repo migration, version was pinned to v9
  - eslint
    - v38.0.0 Highest version that doesn't break linting
  - @io-orkes/conductor-javascript
    - Breaking changes for how to use the Client, workflows etc
*/
const pinned = ["chalk", "@types/diff", "@faker-js/faker"]
const ignored = [
  `bichard7-next-data-(${semver.source})`,
  "p-limit",
  "esbuild",
  "@cucumber/cucumber",
  "@cucumber/pretty-formatter",
  "http-status",
  "eslint",
  "@io-orkes/conductor-javascript"
]

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
