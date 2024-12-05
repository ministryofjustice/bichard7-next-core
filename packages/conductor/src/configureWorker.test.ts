import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"

import completed from "@moj-bichard7/common/conductor/helpers/completed"

import { configureWorker } from "./configureWorker"

describe("configureWorker", () => {
  beforeEach(() => {
    delete process.env.CONCURRENCY
    delete process.env.POLL_INTERVAL
    delete process.env.CONCURRENCY_TEST_TASK
    delete process.env.POLL_INTERVAL_TEST_TASK
  })

  it("should add in default values for concurrency and poll interval", () => {
    const worker: ConductorWorker = {
      execute: (_: Task) => completed(),
      taskDefName: "test_task"
    }
    const wrappedWorker = configureWorker(worker)

    expect(wrappedWorker).toHaveProperty("concurrency", 10)
    expect(wrappedWorker).toHaveProperty("pollInterval", 100)
  })

  it("should use the task defaults for concurrency and poll interval", () => {
    const worker: ConductorWorker = {
      concurrency: 5,
      execute: (_: Task) => completed(),
      pollInterval: 50,
      taskDefName: "test_task"
    }
    const wrappedWorker = configureWorker(worker)

    expect(wrappedWorker).toHaveProperty("concurrency", 5)
    expect(wrappedWorker).toHaveProperty("pollInterval", 50)
  })

  it("should allow concurrency to be overridden by an environment variable", () => {
    process.env.CONCURRENCY = "99"
    const worker: ConductorWorker = {
      execute: (_: Task) => completed(),
      taskDefName: "test_task"
    }
    const wrappedWorker = configureWorker(worker)

    expect(wrappedWorker).toHaveProperty("concurrency", 99)
  })

  it("should allow concurrency to be overridden by an environment variable per task", () => {
    process.env.CONCURRENCY_TEST_TASK = "999"
    const worker: ConductorWorker = {
      execute: (_: Task) => completed(),
      taskDefName: "test_task"
    }
    const wrappedWorker = configureWorker(worker)

    expect(wrappedWorker).toHaveProperty("concurrency", 999)
  })

  it("should allow poll interval to be overridden by an environment variable", () => {
    process.env.POLL_INTERVAL = "999"
    const worker: ConductorWorker = {
      execute: (_: Task) => completed(),
      taskDefName: "test_task"
    }
    const wrappedWorker = configureWorker(worker)

    expect(wrappedWorker).toHaveProperty("pollInterval", 999)
  })

  it("should allow poll interval to be overridden by an environment variable per task", () => {
    process.env.POLL_INTERVAL_TEST_TASK = "9999"
    const worker: ConductorWorker = {
      execute: (_: Task) => completed(),
      taskDefName: "test_task"
    }
    const wrappedWorker = configureWorker(worker)

    expect(wrappedWorker).toHaveProperty("pollInterval", 9999)
  })
})
