/*
  Pinned:
  - cookies-next
    - v5 contains breaking changes
  - @faker-js/faker
    - v10 has breaking change with Jest
  - cypress
    - v15 doesn't play nice with TypeORM
  - next
    - v16 doesn't load the sass files from @ministryofjustice/frontend

  Ignored:
    - postgres
      - 3.4.8 broke a Type: https://github.com/porsager/postgres/issues/1143
    - cypress-circleci-reporter
      - 0.4.0 changed to module type
*/
const pinned = ["cookies-next", "@faker-js/faker", "cypress", "next", "govuk-frontend"]
const ignored = ["postgres", "cypress-circleci-reporter"]
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
