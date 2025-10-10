// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "cypress"
import setupCustomNodeEvents from "./cypress/plugins"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return setupCustomNodeEvents(on, config)
    },
    baseUrl: "http://localhost:3000/users"
  }
})
