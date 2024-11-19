import type { Task as ConductorTask } from "@io-orkes/conductor-javascript"

type Task<T> = {
  inputData: T
} & ConductorTask

export default Task
