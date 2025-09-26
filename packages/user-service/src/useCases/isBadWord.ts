// eslint-disable-next-line @typescript-eslint/no-var-requires
const badWordsCollection = require("badwords-list")

const badWordsDictionary = badWordsCollection.object

export default (word: string) => {
  return word in badWordsDictionary
}
