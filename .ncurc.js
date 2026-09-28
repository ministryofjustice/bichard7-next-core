/*
  Pinned:
  - chalk
    - v5 is a breaking change
  - @types/diff
    - changed the Change type to require extra values
  - undici
    - v6 supports node v20. Higher versions need > node v20
  - eslint (Keep on v9 until ready for v10)
  - eslint-plugin-perfectionist
  - eslint-plugin-cypress (v7+ requires ESLint 10)
  - eslint-plugin-mocha (v12+ requires ESLint 10)

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

const pinned = new Set([
  "chalk",
  "@types/diff",
  "eslint",
  "eslint-plugin-perfectionist",
  "eslint-plugin-cypress",
  "eslint-plugin-mocha",
  "undici"
])

const ignored = new Set([
  "p-limit",
  "esbuild",
  "@cucumber/cucumber",
  "@cucumber/pretty-formatter",
  "http-status",
  "@typescript-eslint/eslint-plugin",
  "cypress-circleci-reporter",
  "fast-xml-parser"
])

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
