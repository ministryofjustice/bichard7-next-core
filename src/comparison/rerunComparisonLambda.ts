const { BATCH_SIZE } = process.env
if (!BATCH_SIZE) {
  throw Error("BATCH_SIZE environment variable is required")
}

export default async () => {}
