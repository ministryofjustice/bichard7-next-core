# Bichard 7 Core

The code to replace the processing logic of Bichard 7

## Quickstart

### Pre-Requisites

Install the following required components:

- [Docker desktop](https://www.docker.com/products/docker-desktop/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
- [aws-vault](https://github.com/99designs/aws-vault)
- [jq](https://stedolan.github.io/jq/download/)

### Booting the infrastructure

This project has a number of external dependencies that need building in order to run the whole stack. Check the
following out and run `make build` in each repository:

- [Docker Images](https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images)
  - Make command is `make build-local` for this repo
- [Bichard7 Liberty](https://github.com/ministryofjustice/bichard7-next)
  - Make command is `make buid` for this repo, or
  - `make build-debug` if you need to run Bichard in debug mode
- [PNC Emulator](https://github.com/ministryofjustice/bichard7-next-pnc-emulator)
- [BeanConnect](https://github.com/ministryofjustice/bichard7-next-beanconnect)
- [End-to-end tests](https://github.com/ministryofjustice/bichard7-next-tests)
- [Nginx Authentication Proxy](https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Nginx_Auth_Proxy)
- [Audit Logging](https://github.com/ministryofjustice/bichard7-next-audit-logging)
  - Make command is `make build-api-server build-event-handler-server` for this repo
- [User Service](https://github.com/ministryofjustice/bichard7-next-user-service)
  - Make command is `make build` for this repo

Bichard relies on a number of containers to run from end to end. These can all be booted up by running:

```
aws-vault exec bichard7-shared -- npm run all
```

This will pull down the images from ECR so you don't need to build them. On an M1 Mac, see below.

You can also run subsets of the infrastructure using:

- `npm run bichard-legacy` will run old Bichard, ActiveMQ, Postgres, BeanConnect, PNC Emulator, User Service, Auth Proxy and the new UI
- `npm run conductor` will run Conductor, Postgres, Localstack and the worker
- `npm run conductor-no-worker` will run Conductor, Postgres, Localstack and will not run the worker (for development purposes)

You can also run the [end-to-end tests](https://github.com/ministryofjustice/bichard7-next-tests) against core in Conductor with:

```
npm run test:e2e
```

Finally, to bring all of that infrastructure down again, you can use:

```
npm run destroy
```

### Running legacy Bichard in debug mode

1. Use Intellij (VS Code doesn't work for debugging) to open the [bichard7-next](https://github.com/ministryofjustice/bichard7-next) project
1. Build a debug image using `make clean build-debug`
1. Run the legacy infrastructure using `npm run bichard-legacy-debug`
1. In IntelliJ select `Run >> Edit Configurations` from the menu
1. Click the `+` button in the top left and select `Remote JVM Debug`
1. Set the port to `7777` and give the configuration a name
1. Select `Run >> Debug` and then choose the configuration you just created
1. Click the green bug icon and you should see `Connected to the target VM, address: 'localhost:7777', transport: 'socket'` printed out
1. Set breakpoints then use Bichard and IntelliJ will let you step through the code

### Building on an M1 Mac

We can't pull the images down from ECR for an M1 Mac because they are not in ARM format. Therefore it is necessary to build the relevant images yourself.

1. In the [bichard7-next-infrastructure-docker-images](https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/) repository, run `make build-local` to just build the required images
1. Follow the instructions in the [bichard7-next](https://github.com/ministryofjustice/bichard7-next/#building-liberty-on-arm) repository to build the Bichard Open Liberty image
1. In the [bichard7-next-user-service](https://github.com/ministryofjustice/bichard7-next-user-service/) repository run `make build`
1. In the [bichard7-next-ui](https://github.com/ministryofjustice/bichard7-next-ui/) repository, run `make build`

## Publishing package updates

The code in this repository is packaged in the [`@moj-bichard7-developers/bichard7-next-core` NPM package](https://www.npmjs.com/package/@moj-bichard7-developers/bichard7-next-core).

To deploy a new version of the package:

1. Manually bump the version number in `package.json` in your PR. It's recommended to follow [semantic versioning principles](https://semver.org).
1. Merge your PR into the `main` branch.
1. Run the [`Release` GitHub action](https://github.com/ministryofjustice/bichard7-next-core/actions/workflows/release.yml) against the `main` branch, by clicking the "Run workflow" button in the Actions interface.

## Testing

To run unit tests against the new Bichard:

```bash
npm i # If packages not already installed
npm t
```

To run unit tests against old Bichard (_requires the [old Bichard](https://github.com/ministryofjustice/bichard7-next) stack to be running_):

```bash
npm i # If packages not already installed
npm run test:bichard
```

## Excluding Triggers

Triggers can be excluded for either a specific `force` or `court` by adding the trigger code (e.g, `TRPR0001`) to either `data/excluded-trigger-configuration.json` for production systems or `data/excluded-trigger-configuration.test.json` for test environments.

The choice of which `excluded-trigger-configuration` file to use is decided in `src/lib/excludedTriggerConfig.ts` using the `NODE_ENV` environment variable. The test configuration file (`excluded-trigger-configuration.test.json`) is run if `NODE_ENV` is set as `testing`.

| Environment Variable | Description                          |
| -------------------- | ------------------------------------ |
| NODE_ENV             | The environment node is being run in |

## Comparing New and Old Bichard

Old Bichard is currently configured to publish its outputs (AHO, triggers, exceptions), plus the original message it received to the `PROCESSING_VALIDATION_QUEUE` queue in ActiveMQ. We can compare these outputs against new Bichard by running:

```bash
npm i # If packages not already installed
npm run compare
```

This requires the [old Bichard](https://github.com/ministryofjustice/bichard7-next) stack to be running. Outputs from old Bichard can be driven onto the queue by running either `make pushq` in the [old Bichard repo](https://github.com/ministryofjustice/bichard7-next), or by running `npm t` in the [e2e testing repo](https://github.com/ministryofjustice/bichard7-next-tests).

`npm run compare` runs the `scripts/compareResults.ts` script to check the output of old Bichard against new Bichard. A tally is kept of the results and can be seen by exiting the script with `Ctrl-C`. If `compareResults.ts` can't process any messages off the queue (empty messages, ActiveMQ errors ect), these are recorded as `skipped` and will be counted seperatly.

If all comparisons between the new and old Bichard are successful, `compareResults.ts` will exit with a `0` code. If any comparisions have failed or messages have been skipped, it will exit with a code of `1`.

### Checking a comparison file

You can run a cli tool to see if a comparison json file matches using:

```
npm run compare -- -f <path to json file>
```

You can also run this tool against the comparison files collected in production using the following arguments:

```
Options

  -f, --file string     Specify either the local file path or an S3 URL
  -s, --start string    Specify the start timestamp in ISO8601 format
  -e, --end string      Specify the end timestamp in ISO8601 format
  -p, --filter string   Filter based on the last result. Specify either 'failure', 'success', 'both'.
                        Default is 'failure'
  -c, --cache           Cache the comparison files
  -h, --help            Prints this usage guide
  -t, --noTruncate      Stops truncating the unchanged sections of XML diffs
```

You will need to run it using `aws-vault`

### Checking a comparison file on old Bichard

```
npm run compare:runonbichard -- <path to json file>
```

You will need to run it using `aws-vault`

To run old Bichard in debug mode, follow [this guide](https://github.com/ministryofjustice/bichard7-next#debugging-bichard-in-open-liberty).

### Comparing outputs locally

If being run locally, it may be clearer to run:

```bash
npm run compare:dev
```

This mode pretty-prints the `Pino` logs and makes it a bit clearer as to what's going on. However, it is **NOT** suitable for production environments (as per their docs).

### Configuration

| Environment Variable   | Description                                                       | Default                            |
| ---------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| MQ_HOST                | The host URL of the ActiveMQ messaging queue                      | localhost                          |
| MQ_PORT                | The host port of the ActiveMQ messaging queue                     | 61613                              |
| MQ_CONNECTION_HOST     | The connection target for the ActiveMQ messaging queue            | /                                  |
| MQ_CONNECTION_LOGIN    | The login username for the ActiveMQ messaging queue               | admin                              |
| MQ_CONNECTION_PASSCODE | The login password for the ActiveMQ messaging queue               | admin                              |
| MQ_QUEUE_NAME          | The ActiveMQ queue to subscribe to                                | /queue/PROCESSING_VALIDATION_QUEUE |
| PINO_LOG_LEVEL         | The logging level used by Pino, the logger used within the script | info                               |

## Conductor

[Conductor](https://github.com/conductor-oss/conductor) is used to run Core in production, and can also be run locally.

To start Conductor locally:

```bash
# Run conductor using an in-memory database
npm run conductor

# OR
# Run the full set of conductor infrastructure with postgres
npm run conductor-full
```

The Conductor UI is available (by default) on [http://localhost:5002](http://localhost:5002), and the API is available at [http://localhost:5002/api](http://localhost:5002/api). There's also API documentation available at [http://localhost:5002/swagger-ui/index.html](http://localhost:5002/swagger-ui/index.html).

You can then import the task and workflow JSON definitions into the Conductor instance:

```bash
# Import the workflow and task definitions
npm run conductor-setup
```

It should then be possible start workflow executions using either the Conductor UI (via the [Workbench](http://localhost:5002/workbench)) or the Conductor API.

In order to then actually process the scheduled executions, you need to run one or more workers:

```bash
# Run a worker to process Conductor tasks
npm run conductor-worker
```

Depending on the tasks you wish to process, you may need to configure the worker with the appropriate environment variables, and/or run using aws-vault:

```bash
PHASE1_COMPARISON_TABLE_NAME="bichard-7-e2e-test-comparison-log" \
DYNAMO_REGION="eu-west-2" \
DYNAMO_URL="https://dynamodb.eu-west-2.amazonaws.com" \
S3_REGION="eu-west-2" \
aws-vault exec bichard7-shared-e2e-test -- npm run conductor-worker
```

See the docker compose file for Conductor for an up to date list of environment variables required
