import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"

const taskDefName = "send_cjsm_message"

const sendCJSMMessage: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: () => {
    // pull out emails and content from inputs
    // error if no emails provided
    // error if no message provided
    // error if no subject provided

    // send the email
    return Promise.resolve({
      status: "COMPLETED"
    })
  }
}

export default sendCJSMMessage
