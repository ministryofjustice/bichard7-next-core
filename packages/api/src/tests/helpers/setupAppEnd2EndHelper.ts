import type { FastifyInstance } from "fastify"
import build from "../../app"
import End2EndPostgresGateway from "../testGateways/e2ePostgresGateway"

export class SetupAppEnd2EndHelper {
  static async setup(port: number = 8888): Promise<SetupAppEnd2EndHelper> {
    const gateway = new End2EndPostgresGateway()
    const app = await build(gateway)
    await app.ready()
    app.listen({ port })

    return new SetupAppEnd2EndHelper(port, app, gateway)
  }

  readonly address: string

  constructor(
    readonly port: number,
    readonly app: FastifyInstance,
    readonly gateway: End2EndPostgresGateway
  ) {
    this.address = `http://localhost:${port}`
  }
}
