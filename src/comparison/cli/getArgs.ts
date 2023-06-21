// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from "ts-command-line-args"

interface IArguments {
  cache?: boolean
  directory?: string
  end?: string
  file?: string
  filter?: string
  help?: boolean
  list?: boolean
  matching?: boolean
  noTruncate?: boolean
  runMissing?: string
  start?: string
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
      directory: {
        type: String,
        alias: "d",
        optional: true,
        description: "Specify a local directory to run the tests from"
      },
      list: {
        type: Boolean,
        alias: "l",
        optional: true,
        description: "Just output the failure paths as a list"
      },
      runMissing: {
        type: String,
        alias: "m",
        optional: true,
        description: "Specify part of the the S3 URL e.g. 2022/08/31"
      },
      start: { type: String, alias: "s", optional: true, description: "Specify the start timestamp in ISO8601 format" },
      end: { type: String, alias: "e", optional: true, description: "Specify the end timestamp in ISO8601 format" },
      filter: {
        type: String,
        alias: "p",
        optional: true,
        defaultValue: "failure",
        description:
          "Filter based on the last result. Specify either 'failure', 'success', 'both'. Default is 'failure'"
      },
      cache: {
        type: Boolean,
        alias: "c",
        optional: true,
        defaultValue: false,
        description: "Cache the comparison files"
      },
      help: { type: Boolean, optional: true, alias: "h", description: "Prints this usage guide" },
      noTruncate: {
        type: Boolean,
        optional: true,
        alias: "t",
        description: "Stops truncating the unchanged sections of XML diffs"
      },
      matching: {
        type: Boolean,
        optional: true,
        defaultValue: false,
        alias: "x",
        description: "Runs using the PNC offence matching algorithm"
      }
    },
    {
      helpArg: "help"
    }
  )

export default getArgs
