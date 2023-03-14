// eslint-disable-next-line import/no-extraneous-dependencies
import S3rver from "s3rver"
import phase1 from "../src/steps/phase1"

type Record = {
  s3: {
    object: {
      key: string
    }
  }
}

type NewRecordEvent = {
  Records: Record[]
}

const handleRecord = async (record: Record) => {
  console.log(`Processing fils form S3: ${record.s3.object.key}`)
  try {
    await phase1(record.s3.object.key)
  } catch (e) {
    console.error(e)
  }
}

const main = async () => {
  const server = new S3rver({
    port: 4570,
    address: "localhost",
    silent: true,
    configureBuckets: [
      {
        name: process.env.PHASE_1_BUCKET_NAME ?? "phase1",
        configs: []
      }
    ]
  })
  await server.run()
  ;(server as any).on("event", (event: NewRecordEvent) => event.Records.map(handleRecord))
}

main()
  .then()
  .catch((err) => console.error(err))
