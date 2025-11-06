/*
  Pinned:
  - cookies-next
    - v5 contains breaking changes
  - @faker-js/faker
    - v10 has breaking change with Jest
  - cypress
    - v15 doesn't play nice with TypeORM

  Ignored:
  - eslint
    - v38.0.0 Highest version that doesn't break linting
*/
const pinned = ["cookies-next", "@faker-js/faker", "cypress"]
const ignored = ["eslint"]
const skipped = [{ package: "next", version: "13.4.13" }]

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
    if (ignored.some((ignore) => ignore.pkg === pkg)) {
      return false
    }
    if (skipped.some((skip) => skip.pkg === pkg && skip.version === upgradedVersion)) {
      return false
    }
    return true
  }
}
