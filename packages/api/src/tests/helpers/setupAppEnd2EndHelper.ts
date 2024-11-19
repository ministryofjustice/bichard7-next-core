import type { FastifyInstance } from "fastify"
import build from "../../app"
import End2EndPostgres from "../testGateways/e2ePostgres"

export class SetupAppEnd2EndHelper {
  static async setup(port: number = 8888): Promise<SetupAppEnd2EndHelper> {
    const db = new End2EndPostgres()
    const app = await build({ db: db })
    await app.ready()
    app.listen({ port })

    return new SetupAppEnd2EndHelper(port, app, db)
  }

  readonly address: string

  constructor(
    readonly port: number,
    readonly app: FastifyInstance,
    readonly db: End2EndPostgres
  ) {
    this.address = `http://localhost:${port}`
  }
}
