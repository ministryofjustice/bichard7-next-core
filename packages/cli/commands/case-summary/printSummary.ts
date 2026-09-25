import type Metadata from "./types/Metadata"
import textStyle from "./utils/textStyle"

let isLastLineAnEmptyLine = false
const fieldsToHighlight = ["Code", "Result code", "Disposal code"]

const printOnlyOneNewLine = () => {
  if (isLastLineAnEmptyLine) {
    return
  }

  process.stdout.write("\n")
  isLastLineAnEmptyLine = true
}

const print = (text: string, level: number, ...textColours: string[]) => {
  if (text) {
    isLastLineAnEmptyLine = false
  }

  const colourCharacters = textColours.length > 0 ? textColours.join("") : textStyle.default
  process.stdout.write(`${" ".repeat(level * 4)}${colourCharacters}${text}${textStyle.reset}\n`)
}

const printLine = () => {
  print("═".repeat(60), 0, textStyle.boldWhite)
}

const printMetadata = (metadata: Metadata) => {
  const { title, errors, timestamp } = metadata
  printOnlyOneNewLine()
  printLine()
  print(`${title}\t${timestamp}`, 0, textStyle.boldWhite)
  printLine()
  if (errors.length > 0) {
    print("Failed with the following error message(s):", 0, textStyle.fg.red, textStyle.bold, textStyle.italic)
    print(errors.map((error) => `\t${error}`).join("\n"), 0, textStyle.fg.red, textStyle.bold, textStyle.italic)
    print("-".repeat(60).trim(), 0, textStyle.fg.red, textStyle.bold)
    printOnlyOneNewLine()
  }

  isLastLineAnEmptyLine = true
}

const printSummary = (obj: object, level = 0) => {
  Object.keys(obj).forEach((key) => {
    const value = (obj as Record<string, unknown>)[key]

    if (value === undefined || value === "") {
      return
    }

    if (key === "metadata") {
      printMetadata(value as Metadata)
      return
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return
      }

      if (typeof value[0] === "object") {
        printOnlyOneNewLine()
        print(`--- ${key} ---`, level + 1, textStyle.default, textStyle.bold)
        value.forEach((item) => {
          printSummary(item, level + 1)
          printOnlyOneNewLine()
        })
      } else {
        print(`${textStyle.midGrey}${key}: ${textStyle.default}${value.join(", ")}${textStyle.reset}`, level)
      }

      return
    } else if (typeof value === "object") {
      print(`${key}:`, level, textStyle.midGrey, textStyle.bold)
      printSummary(value as object, level + 1)
      printOnlyOneNewLine()
      return
    }

    if (fieldsToHighlight.includes(key)) {
      print(`${key}: ${value}`, level, textStyle.brightWhite)
    } else {
      print(`${textStyle.midGrey}${key}: ${textStyle.default}${value}${textStyle.reset}`, level)
    }
  })
}

export default printSummary
