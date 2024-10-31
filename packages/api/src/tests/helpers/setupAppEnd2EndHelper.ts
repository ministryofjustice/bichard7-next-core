import type { FastifyInstance } from "fastify"
import build from "../../app"
import End2EndPostgresGateway from "../testGateways/e2ePostgresGateway"

export class SetupAppEnd2EndHelper {
  static async setup(port: number = 8888): Promise<SetupAppEnd2EndHelper> {
    const dataStoreGateway = new End2EndPostgresGateway()
    const app = await build({ dataStoreGateway })
    await app.ready()
    app.listen({ port })

    return new SetupAppEnd2EndHelper(port, app, dataStoreGateway)
  }

  readonly address: string

  constructor(
    readonly port: number,
    readonly app: FastifyInstance,
    readonly dataStoreGateway: End2EndPostgresGateway
  ) {
    this.address = `http://localhost:${port}`
  }
}
