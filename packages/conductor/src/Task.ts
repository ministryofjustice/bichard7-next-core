import type { Task as ConductorTask } from "@io-orkes/conductor-javascript"

type Task<T> = ConductorTask & {
  inputData: T
}

export default Task
