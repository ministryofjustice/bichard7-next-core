# B7 CLI tool

A simple CLI tool for everyday tasks on Bichard. It uses a library called [Commander.js](https://github.com/tj/commander.js).

## Getting started

To install the CLI tool:

```bash
npm run install:global
```

## Usage

To invoke the tool, the command is `b7`:

```
CLI tool for Bichard 7

Options:
  -V, --version    	output the version number
  --e2e            	Use the e2e environment
  --uat            	Use the uat environment
  --preprod        	Use the preprod environment
  --prod           	Use the production environment
  --shared         	Use the shared environment
  -h, --help       	display help for command

Commands:
  status [options] 	Get healthcheck endpoint output from production
  dev-sgs          	Apply dev security groups to out environments
  fetch-image <image>  Fetch images from AWS Elastic Container Repository
  message-processing   EventBridge rule that forwards incoming messages through to Conductor
  conductor        	Bichard workflow engine
  cloudwatch       	A method for querying cloudwatch for user events
  help [command]   	display help for command)
```

Each subcommand has its own help docs you can provide the `-h or --help` flag e.g. `b7 dev-sgs --help`

```
b7 dev-sgs --help
Usage: b7 dev-sgs [options]

Apply dev security groups to out environments

Options:
  -h, --help  display help for command
```

## Development

If you want to do some development work on this tool, you can run the watch command `npm run install:watch`.

## Querying CloudWatch

A common user query is that a user cannot log into Bichard. This is typically because the user has used an email address that doesn't match what we have stored in the database.

Previously, we had to log into AWS and check container logs for user activity but now we can easily query our User service and postfix logs with a users email.

```bash
b7 cloudwatch user-service --start-time <hours> <email address>
```

If you do not provide the `--start-time or -s` flag it defaults to an hour.
The email address uses a wildcard so you can specify a partial email if you want to check for all user logins for a specific time frame when users are reporting Bichard is down.

`b7 cloudwatch user-service --start-time 2 avonandsomerset`

The above example would search for anyone with `avonandsomerset` in the past 2 hours

## Conductor

The command we have for opening Conductor fetches credentials from AWS and logs us into the Conductor UI

> [!NOTE] We are using osascript to interact with the browser, the support for firefox is somewhat limited so and firefox users will need to refresh the browser on load.
