# Conductor

[Conductor](https://github.com/conductor-oss/conductor) is a workflow orchestration system
with [core concepts involving tasks, workflows and workers](https://orkes.io/content/core-concepts).
It's used to manage the processing of messages from the Courts to the Police, and can be used to run our
[comparison tests](../../README.md#comparing-new-and-old-bichard).

## Contents

- [Getting started](#getting-started)
  - [Viewing Conductor in a deployed environment](#viewing-conductor-in-a-deployed-environment)
  - [Running Conductor locally](#running-conductor-locally)
  - [Starting a workflow](#starting-a-workflow)
- [Usage](#usage)
  - [Running the worker for development](#running-the-worker-for-development)
  - [Running the tests](#running-the-tests)
  - [Running the worker connected to a deployed environment](#running-the-worker-connected-to-a-deployed-environment)

## Getting started

### Viewing Conductor in a deployed environment

We have a script ([open-conductor.sh](./scripts/open-conductor.sh)) that will retrieve the password for Conductor in a
deployed environment from AWS, save it to your clipboard, and then automatically open Conductor in your browser.

To view Conductor in one of our deployed environments, run the script with the AWS Vault profile for that environment:

```bash
aws-vault exec <AWS_VAULT_PROFILE> -- npm run conductor:open
# E.g. aws-vault exec qsolution-production -- npm run conductor:open
```

### Running Conductor locally

To start Conductor locally without Bichard, but with all its dependencies like LocalStack, PostgreSQL and a worker in
Docker:

```bash
npm run conductor
```

This makes available:

- the Conductor UI on [http://localhost:5002](http://localhost:5002) (by default)
- the Conductor API on [http://localhost:5002/api](http://localhost:5002/api)
- the Conductor API documentation
  on [http://localhost:5002/swagger-ui/index.html](http://localhost:5002/swagger-ui/index.html)

It also imports the latest task and workflow JSON definitions into Conductor as part of this command, however you can
run this manually:

```bash
npm run setup -w packages/conductor
```

### Starting a workflow

A workflow can be manually started via the [Workbench](http://localhost:5002/workbench) or API, on a schedule, or on
an event trigger. Most of our workflows are triggered by SQS e.g. the processing of an incoming message from the Courts.

## Usage

### Running the worker for development

Conductor manages workflows and tasks, but a worker executes a task and runs separately from Conductor.

1. Run everything, apart from the worker, in Docker.

```bash
npm run all-no-worker
```

2. Build the worker. When making changes, be sure to build before rerunning the worker to see your changes.

```bash
npm run build  # To build all the packages
# Or
npm run build -w packages/conductor  # To just build the worker
```

3. Run the worker. This runs it outside of Docker to avoid having to rebuild the Docker image for the worker whenever a
   change has been made.

```bash
npm run worker -w packages/conductor
```

### Running the tests

1. Get [everything running](#running-the-worker-for-development), but for starting the worker use:

```bash
PHASE_2_QUEUE_NAME=TEST_PHASE2_QUEUE npm run worker -w packages/conductor
```

2. Run the end-to-end tests.

```bash
npm run test -w packages/conductor
```

### Running the worker connected to a deployed environment

By default, running the worker locally uses [local-conductor-worker.env](../../environment/local-conductor-worker.env)
which is set to connect to LocalStack instead of AWS for DyanmoDB and S3.

However, it can be useful to connect your local instance of the worker to the AWS services of one of our deployed
environments. For example, when making changes to the Conductor task that runs the comparison tests, using the
comparison records in DyanmoDB for production may be helpful.

1. Update [local-conductor-worker.env](../../environment/local-conductor-worker.env) with the environment variables for
   the environment, see the comments in the file for which are relevant.
2. Run the worker with the AWS Vault profile for the environment:

```bash
aws-vault exec <AWS_VAULT_PROFILE> -- npm run worker -w packages/conductor
# E.g. aws-vault exec qsolution-production -- npm run worker -w packages/conductor
```

Alternatively, you can provide your own `.env` file and run:

```bash
aws-vault exec <AWS_VAULT_PROFILE> -- npm run worker-noenv -w packages/conductor
# E.g. aws-vault exec qsolution-production -- npm run worker-noenv -w packages/conductor
```
