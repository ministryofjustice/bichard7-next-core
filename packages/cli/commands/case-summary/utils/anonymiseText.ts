const anonymiseText = (text: string): string =>
  Array.from(text).reduce((acc, char) => {
    acc += [" ", "\n"].includes(char) ? char : "?"
    return acc
  }, "")

export default anonymiseText
