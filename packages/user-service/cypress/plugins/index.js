/* eslint-disable import/first */
/* eslint-disable import/order */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
import pgPromise from "pg-promise"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import insertGroupHierarchies from "../../testFixtures/database/insertGroupHierarchies"
import insertIntoUsersAndGroupsTable from "../../testFixtures/database/insertIntoUsersAndGroupsTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoServiceMessagesTable from "../../testFixtures/database/insertIntoServiceMessagesTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import manyUsers from "../../testFixtures/database/data/manyUsers"
import serviceMessages from "../../testFixtures/database/data/serviceMessages"

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  const pgp = pgPromise()
  const db = pgp("postgres://bichard:password@localhost:5432/bichard")

  on("task", {
    async getVerificationCode(emailAddress) {
      const result = await db
        .one("SELECT email_verification_code FROM br7own.users WHERE email = $1", emailAddress)
        .catch(console.error)

      return result.email_verification_code
    },

    async getPasswordResetCode(emailAddress) {
      const result = await db
        .one("SELECT password_reset_code FROM br7own.users WHERE email = $1", emailAddress)
        .catch(console.error)

      return result.password_reset_code
    },

    async deleteFromUsersTable() {
      await deleteFromTable("users")
      return null
    },

    async deleteFromGroupsTable() {
      await deleteFromTable("groups")
      return null
    },

    async deleteFromUsersGroupsTable() {
      await deleteFromTable("users_groups")
      return null
    },

    async deleteFromServiceMessagesTable() {
      await deleteFromTable("service_messages")
      return null
    },

    async insertIntoUsersTable() {
      await insertIntoUsersTable(users)
      return null
    },

    async insertGroupHierarchies() {
      await insertGroupHierarchies()
      return null
    },

    async insertIntoGroupsTable() {
      await insertIntoGroupsTable(groups)
      return null
    },

    async insertManyIntoUsersTable(maxNumberOfUsers) {
      const usersToInsert = maxNumberOfUsers ? manyUsers.slice(0, maxNumberOfUsers) : manyUsers
      await insertIntoUsersTable(usersToInsert)
      return null
    },

    async insertIntoUserGroupsTable({ email, groups: selectedGroups }) {
      await insertIntoUserGroupsTable(email, selectedGroups)
      return null
    },

    async insertIntoServiceMessagesTable() {
      await insertIntoServiceMessagesTable(serviceMessages)
      return null
    },

    async selectFromGroupsTable(whereColumn, whereValue) {
      const selectedGroups = await selectFromTable("groups", whereColumn, whereValue, "name")
      return selectedGroups
    },

    async selectFromUsersTable(emailAddress) {
      const selectedUsers = await selectFromTable("users", "email", emailAddress)
      return selectedUsers[0]
    },

    async selectFromUsersGroupsTable(userId) {
      const groupsUsers = await selectFromTable("users_groups", "user_id", userId)
      return groupsUsers
    },

    async selectGroupsForUser(emailAddress) {
      const groupsForUser = await db.any(
        ` SELECT
            g.*
          FROM
            br7own.users u
            INNER JOIN br7own.users_groups ug ON ug.user_id = u.id
            INNER JOIN br7own.groups g ON ug.group_id = g.id
          WHERE
          u.email = $1`,
        emailAddress
      )

      return groupsForUser
    },

    async insertIntoUsersAndGroupsTable() {
      await insertIntoUsersAndGroupsTable(users, groups)
      return null
    }
  })
}
