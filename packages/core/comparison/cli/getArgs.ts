// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from "ts-command-line-args"

export interface IArguments {
  cache?: boolean
  directory?: string
  end?: string
  file?: string
  filelist?: string
  filter?: string
  help?: boolean
  list?: boolean
  matching?: boolean
  noTruncate?: boolean
  phase?: number
  runMissing?: string
  start?: string
}

export const getArgs = () =>
  parse<IArguments>(
    {
      cache: {
        alias: "c",
        defaultValue: false,
        description: "Cache the comparison files",
        optional: true,
        type: Boolean
      },
      directory: {
        alias: "d",
        description: "Specify a local directory to run the tests from",
        optional: true,
        type: String
      },
      end: { alias: "e", description: "Specify the end timestamp in ISO8601 format", optional: true, type: String },
      file: {
        alias: "f",
        description: "Specify either the local file path or an S3 URL",
        optional: true,
        type: String
      },
      filelist: {
        alias: "z",
        description: "Specify a file containing a list of tests to run",
        optional: true,
        type: String
      },
      filter: {
        alias: "p",
        defaultValue: "failure",
        description:
          "Filter based on the last result. Specify either 'failure', 'success', 'both'. Default is 'failure'",
        optional: true,
        type: String
      },
      help: { alias: "h", description: "Prints this usage guide", optional: true, type: Boolean },
      list: {
        alias: "l",
        description: "Just output the failure paths as a list",
        optional: true,
        type: Boolean
      },
      matching: {
        alias: "x",
        defaultValue: false,
        description: "Runs using the PNC offence matching algorithm",
        optional: true,
        type: Boolean
      },
      noTruncate: {
        alias: "t",
        description: "Stops truncating the unchanged sections of XML diffs",
        optional: true,
        type: Boolean
      },
      phase: {
        defaultValue: 2,
        description: "Select which project phase to use",
        optional: true,
        type: Number
      },
      runMissing: {
        alias: "m",
        description: "Specify part of the the S3 URL e.g. 2022/08/31",
        optional: true,
        type: String
      },
      start: { alias: "s", description: "Specify the start timestamp in ISO8601 format", optional: true, type: String }
    },
    {
      helpArg: "help"
    }
  )

export default getArgs
