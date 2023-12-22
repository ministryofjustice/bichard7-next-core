import createS3Config from "../../s3/createS3Config"
import putFileToS3 from "../../s3/putFileToS3"

const s3Config = createS3Config()
const TASK_DATA_BUCKET_NAME = "conductor-task-data"

export const putIncomingMessageToS3 = async (fixture: object | string, path: string, correlationId: string) => {
  let message = typeof fixture === "string" ? fixture : JSON.stringify(fixture)
  message = message.replace("CORRELATION_ID", correlationId)
  await putFileToS3(message, path, TASK_DATA_BUCKET_NAME, s3Config)
}
