const clearTimeouts = (handles: NodeJS.Timeout[]) => handles.forEach(clearTimeout)

type PollerOptions<T> = {
  timeout: number
  delay: number
  condition: (result: T) => boolean
  name: string
}

class Poller<T> {
  action: () => Promise<T>

  constructor(action: () => Promise<T>) {
    this.action = action
  }

  poll(options: PollerOptions<T>): Promise<T> {
    const { timeout, delay, condition, name } = options
    let isDone = false

    return new Promise((resolve, reject) => {
      const processHandles: NodeJS.Timeout[] = []
      const startTime = Date.now()

      const timeoutHandle = setTimeout(() => {
        if (isDone) {
          return
        }

        isDone = true
        clearTimeouts([timeoutHandle, ...processHandles])
        const totalSeconds = (Date.now() - startTime) / 1000
        reject(new Error(`Failed polling due to exceeding the timeout after ${totalSeconds} seconds. (${name})`))
      }, timeout)

      const process = async () => {
        const result: T = await this.action()
        if (isDone) {
          return
        }

        if (condition(result)) {
          isDone = true
          clearTimeouts([timeoutHandle, ...processHandles])
          resolve(result)
        } else if (!isDone) {
          processHandles.push(setTimeout(process, delay))
        }
      }

      process()
    })
  }
}

export default Poller
