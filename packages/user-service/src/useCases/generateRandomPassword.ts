import config from "lib/config"
import wordListPath from "word-list"
import fs from "fs"
import crypto from "crypto"
import isBadWord from "./isBadWord"

const wordArray = fs
  .readFileSync(wordListPath, "utf8")
  .split("\n")
  .filter(
    (word) =>
      word.length >= config.suggestedPasswordMinWordLength && word.length <= config.suggestedPasswordMaxWordLength
  )

export default () => {
  let result = ""
  let i = config.suggestedPasswordNumWords
  while (i > 0) {
    const trueRandomIndex = crypto.randomInt(wordArray.length)
    const randomWord = wordArray[trueRandomIndex]
    if (!isBadWord(randomWord)) {
      i -= 1
      result += randomWord.charAt(0).toUpperCase() + randomWord.slice(1)
    }
  }

  return result
}
