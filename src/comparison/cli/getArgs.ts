// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from "ts-command-line-args"

interface IArguments {
  file?: string
  start?: string
  end?: string
  filter?: string
  help?: boolean
}

export const getArgs = () =>
  parse<IArguments>(
    {
      file: {
        type: String,
        alias: "f",
        optional: true,
        description: "Specify either the local file path or an S3 URL"
      },
      start: { type: String, alias: "s", optional: true, description: "Specify the start timestamp in ISO8601 format" },
      end: { type: String, alias: "e", optional: true, description: "Specify the end timestamp in ISO8601 format" },
      filter: {
        type: String,
        alias: "p",
        optional: true,
        defaultValue: "failure",
        description: "Specify either 'failure', 'success', 'both'. Default is 'failure'"
      },
      help: { type: Boolean, optional: true, alias: "h", description: "Prints this usage guide" }
    },
    {
      helpArg: "help"
    }
  )

export default getArgs
