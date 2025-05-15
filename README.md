# Bichard 7 Core<!-- omit from toc -->

The code to replace the processing logic of Bichard 7.

## Contents<!-- omit from toc -->

- [Structure of this Monorepo](#structure-of-this-monorepo)
- [Quickstart](#quickstart)
  - [Pre-Requisites](#pre-requisites)
  - [Booting the infrastructure](#booting-the-infrastructure)
  - [Running legacy Bichard in debug mode](#running-legacy-bichard-in-debug-mode)
  - [Building on an M1 Mac](#building-on-an-m1-mac)
- [Running Packages locally](#running-packages-locally)
- [Publishing package updates](#publishing-package-updates)
- [Testing](#testing)
- [Excluding Triggers](#excluding-triggers)
- [Comparing New and Old Bichard](#comparing-new-and-old-bichard)
  - [Checking a comparison file](#checking-a-comparison-file)
  - [Checking a comparison file on old Bichard](#checking-a-comparison-file-on-old-bichard)
  - [Comparing outputs locally](#comparing-outputs-locally)
  - [Configuration](#configuration)
- [Conductor](#conductor)

## Structure of this Monorepo

Packages:

- [api](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/api)
- [common](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/common)
- [conductor](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/conductor)
- [core](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/core)
- [e2e-test](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/e2e-test)
- [message-forwarder](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/message-forwarder)
- [uat-data](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/uat-data)
- [ui](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/ui)

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

```bash
aws-vault exec bichard7-shared -- npm run all
```

This will pull down the images from ECR so you don't need to build them. On an M1 Mac, see below.

You can also run subsets of the infrastructure using:

- `npm run bichard-legacy` will run old Bichard, ActiveMQ, Postgres, BeanConnect, PNC Emulator, User Service, Auth Proxy and the new UI
- `npm run conductor` will run Conductor, Postgres, Localstack and the worker
- `npm run conductor-no-worker` will run Conductor, Postgres, Localstack and will not run the worker (for development purposes)

You can also run the [end-to-end tests](https://github.com/ministryofjustice/bichard7-next-tests) against core in Conductor with:

```bash
npm run test:e2e
```

Finally, to bring all of that infrastructure down again, you can use:

```bash
npm run destroy
```

### Running legacy Bichard in debug mode

1. Use Intellij (VS Code doesn't work for debugging) to open the [bichard7-next](https://github.com/ministryofjustice/bichard7-next) project
1. Build a debug image using `make clean build-debug`
1. Run the legacy infrastructure using `npm run bichard-legacy-debug` from the Core repo
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
1. In the [bichard7-next-ui](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/ui) package, run `make build` or the top level of [bichard7-next-core](https://github.com/ministryofjustice/bichard7-next-core) run this script `./scripts/build-ui-docker.sh`

## Running Packages locally

1. From the root directory `npm ci`
2. Run `npm run build:core`
3. If you need to change `packages/common` you have to two options, `build` will just build the package once or `watch` all listen for changes and rebuild. You can either:
   1. `cd packages/common`
      1. And run `npm run build`
      2. Or `npm run watch`
   2. Or from the root of Core:
      1. `npm run build -w packages/common`
      2. Or, `npm run watch -w packages/common`
4. Go to the package you want to change and follow that package's README

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

## Conductor

See [README in packages/conductor](./packages/conductor/README.md) for more information.
