import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import { z } from "zod"

const inputDataSchema = z.object({
  messageId: z.uuid()
})
type InputData = z.infer<typeof inputDataSchema>

const testTask: ConductorWorker = {
  taskDefName: "test_task",
  execute: inputDataValidator(inputDataSchema, (task: Task<InputData>) => {
    const { messageId } = task.inputData

    return completed(`Worked? ${messageId}`)
  })
}

export default testTask
