import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

const code = TriggerCode.TRPR0031

describe("TRPR0030", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  // Tests here
})
