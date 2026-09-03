const semver = new RegExp(
  /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/
) // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string

/*
  Pinned:
  - chalk
    - v5 is a breaking change
  - @types/diff
    - changed the Change type to require extra values
  - undici
    - v6 supports node v20. Higher versions need > node v20

  Ignored:
  - p-limit
  - esbuild
    - ignored at v0.18.16 because v0.18.17 doesn't run the postinstall script properly.
  - @cucumber/cucumber
    - from tests repo migration, version was pinned to v9
  - @typescript-eslint/eslint-plugin
    - Breaks dependency tree for eslint-config-next
  - cypress-circleci-reporter
      - 0.4.0 changed to module type
  - fast-xml-parser
    - Breaks above 5.7.2 due to encoding issues. Does not follow semver
*/
const pinned = ["chalk", "@types/diff", "eslint", "eslint-plugin-perfectionist", "undici"]
const ignored = [
  "p-limit",
  "esbuild",
  "@cucumber/cucumber",
  "@cucumber/pretty-formatter",
  "http-status",
  "@typescript-eslint/eslint-plugin",
  "cypress-circleci-reporter",
  "fast-xml-parser"
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
