// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from "ts-command-line-args"

interface IArguments {
  file?: string
  help?: boolean
}

export const getArgs = () =>
  parse<IArguments>(
    {
      file: { type: String, alias: "f", optional: true },
      help: { type: Boolean, optional: true, alias: "h", description: "Prints this usage guide" }
    },
    {
      helpArg: "help"
    }
  )

export default getArgs
