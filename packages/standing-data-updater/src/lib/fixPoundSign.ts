const fixPoundSign = (input: string): string => {
  return input.replace(/ \?(\d)/g, " £$1").replace(/\u007f/g, "£")
}

export default fixPoundSign
