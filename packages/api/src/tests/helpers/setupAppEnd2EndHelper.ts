import type { FastifyInstance } from "fastify"
import build from "../../app"

export class SetupAppEnd2EndHelper {
  static async setup(port: number = 8888): Promise<SetupAppEnd2EndHelper> {
    const app = await build()
    await app.ready()
    app.listen({ port })

    return new SetupAppEnd2EndHelper(port, app)
  }

  readonly address: string

  constructor(
    readonly port: number,
    readonly app: FastifyInstance
  ) {
    this.address = `http://localhost:${port}`
  }
}
