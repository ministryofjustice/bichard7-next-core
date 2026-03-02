export const streamToJson = async (response: Response) => {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let result = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    result += decoder.decode(value, { stream: true })
  }

  result += decoder.decode()

  return JSON.parse(result)
}
