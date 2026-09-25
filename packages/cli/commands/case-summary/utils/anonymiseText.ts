const anonymiseText = (text: string): string => {
  let newCondition = ""
  for (let index = 0; index < text.length; index++) {
    newCondition += [" ", "\n"].includes(text[index]) ? text[index] : "?"
  }

  return newCondition
}

export default anonymiseText
