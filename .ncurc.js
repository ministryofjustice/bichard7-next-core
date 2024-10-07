const semver = new RegExp(
  /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/
) // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string

/*
  Pinned:
  - chalk
    - v5 is a breaking change
  - Fastify and Fastify plugins
    - v5 is not supported by all plugins
    - We're waiting for Fastify v5.0.1 to be released before upgrading

  Ignored:
  - bichard7-next-data-x.x.x
    - ncu updates all of them to the latest version, very unhelpful
  - p-limit
  - esbuild
    - ignored at v0.18.16 because v0.18.17 doesn't run the postinstall script properly.
*/
const pinned = [
  "chalk",
  "eslint",
  "@typescript-eslint/eslint-plugin",
  "fastify",
  "@fastify/autoload",
  "@fastify/swagger",
  "@fastify/swagger-ui"
]
const ignored = [`bichard7-next-data-(${semver.source})`, "p-limit", "esbuild"]

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
