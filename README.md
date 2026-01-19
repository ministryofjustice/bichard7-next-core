# Bichard 7 Core<!-- omit from toc -->

The code to replace the processing logic of Bichard 7.

## Contents<!-- omit from toc -->

- [Structure of this Monorepo](#structure-of-this-monorepo)
- [Quickstart](#quickstart)
  - [Pre-Requisites](#pre-requisites)
  - [Booting the infrastructure](#booting-the-infrastructure)
  - [Setting up the Local Database](#setting-up-the-local-database)
  - [Running legacy Bichard in debug mode](#running-legacy-bichard-in-debug-mode)
- [Running Packages locally](#running-packages-locally)
- [Publishing package updates](#publishing-package-updates)
- [Testing](#testing)
- [Excluding Triggers](#excluding-triggers)
- [Conductor](#conductor)

## Structure of this Monorepo

Packages:

- [api](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/api)
- [cli](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/cli)
- [common](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/common)
- [conductor](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/conductor)
- [core](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/core)
- [e2e-test](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/e2e-test)
- [help](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/help)
- [message-forwarder](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/message-forwarder)
- [uat-data](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/uat-data)
- [ui](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/ui)
- [user-service](https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/user-service)

## Quickstart

### Pre-Requisites

Please follow the instructions in this document:
https://dsdmoj.atlassian.net/wiki/spaces/KB/pages/5879988352/Development+Software+Tools

### Booting the infrastructure

This project has a number of external dependencies that need building in order to run
the whole stack. Clone the following repositories and run the specified build command
for each of them:

- Clone [Docker Images](https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images)
  - Run `SKIP_GOSS=true make build-local`
- Clone [Bichard7 Next (Old Bichard)](https://github.com/ministryofjustice/bichard7-next)
  - Run `make build`, or
  - run `make build-debug` if you need to run Bichard in debug mode
- Clone [PNC Emulator](https://github.com/ministryofjustice/bichard7-next-pnc-emulator)
  - Run `make build`
- Clone [BeanConnect](https://github.com/ministryofjustice/bichard7-next-beanconnect)
  - Run `SKIP_GOSS=true make build`
- Clone [Audit Logging](https://github.com/ministryofjustice/bichard7-next-audit-logging)
  - Run `make build-api-server build-event-handler-server`

There are two folders inside this very repo (bichard7-next-core) that also need building:

- [api](packages/api)
  - Navigate to `packages/api` and run `npm run build:docker`
- [UI](packages/ui)
  - Navigate to `packages/ui` and run `make build`
- [User Service](packages/user-service)
  - Navigate to `packages/user-service` and run `make build`

Then boot up all the containers you will need in order to run Bichard end to end.
You can do this by navigating to the root directory of `bichard7-next-core`and running the following command:

```bash
npm run all
```

You should now have access to the following:

- https://localhost:4443/bichard

You can also run subsets of the infrastructure using:

- `npm run bichard-legacy` will run old Bichard, ActiveMQ, Postgres, BeanConnect, PNC Emulator, User Service, Auth Proxy and the new UI
- `npm run conductor` will run Conductor, Postgres, Localstack and the worker
- `npm run conductor-no-worker` will run Conductor, Postgres, Localstack and will not run the worker (for development purposes)

To run the end-to-end tests, navigate to `packages/e2e-test`, run

```bash
npm ci
```

And then, to run all tests:

```bash
npm run test:nextUI
```

Or to run a specific test, for example test 180 located in the `features` folder:

```bash
npm run test:nextUI:file -- ./features/180*
```

Finally, to bring all of that infrastructure down again, you can use:

```bash
npm run destroy
```

### Setting up the Local Database

In order to log in, you will need to get a username and password
from the local database.

You can access this db in several ways:

#### From WebStorm

Go to `View/Tool Windows/Database`
Go to the db that just opened and click on the Plus (`+`) sign.
Select `Data Source`, and then `PostgreSQL`.

On the `general tab` (opens by default) use the following configuration details:

- `Host: 127.0.0.1`
- `Port: 5432`
- `User: bichard`
- `Password: password`
- `Database: bichard`

On the `Schemas tab`, check `Bichard -> br7own`

#### From TablePlus

Click on `Connection/New` and select `PostgreSQL`

Add the following config details (same as the ones listed above for WebStorm):

- `Host: 127.0.0.1`
- `Port: 5432`
- `User: bichard`
- `Password: password`
- `Database: bichard`

Once done with this configuration, go to the dropdown on the bottom left
and select `br7own`

Now that you have access to the Local Database, you can go to the `users` table and find a valid user
to log into your local Bichard. You will need a user that has a value
for the following columns:

- `email`
- `password`
- `email_verification_code`

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

## Running Packages locally

1. From the root directory `npm ci`
2. Run `npm run build:core`
3. If you need to change `packages/common` you have two options, `build` will just build the package once or `watch` all listen for changes and rebuild. You can either:
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
