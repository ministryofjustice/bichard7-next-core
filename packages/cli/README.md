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
❯ b7
Usage: b7 [options] [command]

CLI tool for Bichard 7

Options:
  -V, --version        output the version number
  --e2e                Use the e2e environment
  --uat                Use the uat environment
  --preprod            Use the preprod environment
  --prod               Use the production environment
  --shared             Use the shared environment
  -h, --help           display help for command

Commands:
  status [options]     Get healthcheck endpoint output from production
  dev-sgs              Apply dev security groups to our environments
  fetch-image <image>  Fetch images from AWS Elastic Container Repository
  import-vpn-profiles  Import VPN profiles into OpenVPN
  message-processing   EventBridge rule that forwards incoming messages through to Conductor
  conductor            Bichard workflow engine
  cloudwatch           A method for querying cloudwatch for user events
  user-comms           A way to send group communications to all users
  help [command]       display help for command
```

Each subcommand has its own help docs you can provide the `-h or --help` flag e.g. `b7 dev-sgs --help`

```

b7 dev-sgs --help
Usage: b7 dev-sgs [options]

Apply dev security groups to out environments

Options:
-h, --help display help for command

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

```bash
b7 cloudwatch user-service --start-time 2 avonandsomerset
```

The above example would search for anyone with `avonandsomerset` in the past 2 hours

## Conductor

The command we have for opening Conductor fetches credentials from AWS and logs us into the Conductor UI

> [!NOTE]
> We are using osascript to interact with the browser, the support for firefox is somewhat limited so and firefox users will need to refresh the browser on load.

## Sending user communications via GovNotify

> [!NOTE]
> You will need to have postgres installed locally to test the connection. Simply run `brew install postgresql` in your terminal

Historically, sending out mass communications to all users has been very involved, with many steps required before we could actually communicate an issue to our users.
Now, we can simply run:

```
b7 user-comms
```

We have some predefined templates that cover scenarios that we've faced in the past. These templates live in the `user-comms` directory.

```
❯ b7 user-comms
? Select a template to use (Use arrow keys)
❯ PNC Scheduled Maintenance
  PNC Maintenance Window Extended
  Outage Notification
  Outage Resolved
Notify users of upcoming scheduled maintenance
```

You can navigate up and down using the arrow keys, or j and k for Vim fans, and press Enter to choose an option.

There are further options depending on the template you choose:

```
❯ b7 user-comms
✔ Select a template to use Outage Notification
? What type of outage are we reporting? (Use arrow keys)
❯ PNC Outage
  PSN Outage
  Bichard Outage
Notify users of a PNC Outage
```

Once you have chosen a template, you will be shown a preview:

```
❯ b7 user-comms
✔ Select a template to use Outage Notification
✔ What type of outage are we reporting? PNC Outage

=== Preview template ===

Hello {first-name},

We wanted to inform you that the PNC Outage is currently experiencing a loss of service. We apologise for any inconvenience this may cause.

We will keep you informed of any updates as soon as we receive them.

If you have any questions, please feel free to contact us at moj-bichard7@madetech.com.

Thank you for your patience and understanding.

Many thanks,
The Bichard 7 Support team

? Do you want to use this template? (y/N)
```

After you hit y, it will query Postgres for all active Bichard users, and you will be shown a preview of the email using a random user—similar to the behaviour in GovNotify.

```
To: wen.ting.wang@madetech.com
Subject: Unexpected PNC Outage

=== Preview template ===

Hello Wen Ting,

We wanted to inform you that the PNC is currently experiencing a loss of service. We apologise for any inconvenience this may cause.

We will keep you informed of any updates as soon as we receive them.

If you have any questions, please feel free to contact us at moj-bichard7@madetech.com.

Thank you for your patience and understanding.

Many thanks,
The Bichard 7 Support team

? Are you happy with the updated template? (y/N)
```

If you are happy with the updated preview, you can hit y, and then you will be asked to type confirm send to send the email. This step ensures that messages aren’t sent accidentally.

We have a blank template in GovNotify, located in a folder called 'CLI Templates', which contains placeholders where the message is inserted. This means we can add more templates to this repository without needing to make any changes in GovNotify.

```
 Type 'confirm send' to send, or press <ctrl-c> to abort: confirm send
✅ Email sent to joe.folkard@madetech.com
✅ Email sent to richard.race@madetech.com
✅ Email sent to ben.pirt@madetech.com
✅ Email sent to emad.karamad@madetech.com
✅ Email sent to richard.cane@madetech.com
✅ Email sent to ian.king@madetech.com
✅ Email sent to tausif.patel@madetech.com
✅ Email sent to wen.ting.wang@madetech.com
```

> [!NOTE]
> Due to the requirement for two-factor authentication (2FA) to create a user account on GovNotify, the API key is currently created using the GovNotify account of a developer working on Bichard.

> If the account associated with the API key is deactivated, the key will need to be updated. In such a case, a user must log in to GovNotify, create a new API key for the live service, and store it in AWS Secrets Manager.
