# @moj-bichard7/e2e-tests<!-- omit from toc -->

This package contains the end-to-end and characterisation tests to run against Bichard in order to validate functionality.

## Contents<!-- omit from toc -->

- [Running the end-to-end tests](#running-the-end-to-end-tests)
  - [Locally](#locally)
    - [Cucumber test individual features](#cucumber-test-individual-features)
  - [Against E2E Test environment](#against-e2e-test-environment)
  - [Against pre-production](#against-pre-production)
  - [Configuration parameters](#configuration-parameters)
  - [Debugging](#debugging)
  - [VS Code Extension](#vs-code-extension)
- [Running the characterisation tests](#running-the-characterisation-tests)
  - [For Core](#for-core)
  - [For legacy Bichard](#for-legacy-bichard)

## Running the end-to-end tests

### Locally

Before running the tests locally, you need to make sure that the environment is up and running. Follow the instructions below to prepare the environment for testing:

- Bichard7 Next - [Quickstart instructions](https://github.com/ministryofjustice/bichard7-next#quickstart-next-stack)
- Bichard7 Next Audit Logging - [Quickstart instructions](https://github.com/ministryofjustice/bichard7-next-audit-logging#quickstart)

Once the stack is up and running, you can run the following commands to run the tests:

```bash
npm install
npm run test
```

If you get an error which looks like:

```bash
Error: Could not find expected browser (chrome) locally.
```

Run `npm install` to download the correct Chromium revision (856583), then run `node node_modules/puppeteer/install.js`.

#### Cucumber test individual features

To run a Cucumber test locally you need to have all Docker images built and running with the latest changes.

For example, if you want to test a change in the Next UI:

1. Kill the current Docker container for the UI.
2. [Build a new Docker image that contains the new changes](https://github.com/ministryofjustice/bichard7-next-core/blob/main/packages/ui/README.md#building-the-docker-image).
3. Run `npm run all` at the root of the Core repository to boot everything up again.

You can then run this command:

```bash
MS_EDGE=true HEADLESS=false NEXTUI=true AWS_URL=http://localhost:4566 npm run test:file features/186*
```

- `MS_EDGE` is what browser it runs the test with. By default it uses Chrome, you need to have download MS Edge to use this feature.
- `HEADLESS` is whether or not we see the browser
- `NEXTUI` is whether we the test in the new UI or the old UI
- `features/186*` runs the feature we want

### Against E2E Test environment

> ⚠️ You'll need to pause the deployment pipeline as it's highly likely a deployment will conflict with your tests.

1. [Connect to the VPN for the E2E Test environment](https://github.com/ministryofjustice/bichard7-next/wiki/Connecting-to-the-VPN).
2. [Enable dev security group rules for the E2E Test environment](https://github.com/ministryofjustice/bichard7-next/wiki/Enabling-the-dev-security-group-rules).
3. Retrieve the environment variables required for E2E test by running:

```bash
WORKSPACE=e2e-test aws-vault exec bichard7-shared-e2e-test -- ./scripts/setup-e2e-tests.sh
```

This creates a `./workspaces/e2e-test.env` file (which is ignored by Git).

4. Source the environment variables file:

```bash
. ./workspaces/e2e-test.env
```

5. Run your test(s) with AWS Vault.

```bash
# For example, to run a feature against E2E Test environment:
aws-vault exec bichard7-shared-e2e-test -- npm run test:file features/719*
```

### Against pre-production

The PNC Test Tool is a legacy tool that is running unreliably in an EC2 instance. You can find it via the AWS Console as it's the only EC2 instance running. At the time of writing its IP address is `10.129.3.16`. You can access the UI via the [Test Tool UI](https://10.129.3.16/)

You will need to restart the OpenUTM service that runs it. To do this, SSH into the instance using the `ansible` user. The password is in SSM: `/cjse-preprod-bichard-7/pnc_tool/ssh_password`. To restart the OpenUTM service:

To SSH into the instance you need to first install `mssh`:

```bash
pip3 install ec2instanceconnectcli
```

You can then SSH into the instance by running the following command:

```bash
aws-vault exec <preprod profile> -- mssh ansible@10.129.3.16 -t <ec2 instance id> -oHostKeyAlgorithms=+ssh-dss
```

To restart the OpenUTM service, run the following commands:

```bash
# Sudo to the utm user
sudo su utm
# cd into the UTM project directory
cd /home/utm/SpsTtUtm
# stop the service
./p/shut
# start the service
./p/start
```

Once you have started the UTM service, you can check it's working by visiting the [Test Tool UI](https://10.129.3.16/), selecting `PNC NASCH Enquiry` and then searching for e.g. `John Smith` - you should see results being returned. If not, try to telnet to the PNC Test endpoint via SSH:

```bash
telnet test-pnc.cjse.org 102
```

It should connect and after you press `Enter` 10 times should disconnect you.

If the Test Tool looks healthy then you can run a test using it as follows (068 is a good test because it doesn't change anything on the PNC so can be run repeatedly)

```bash
PNC_TEST_TOOL=https://10.129.3.16 REAL_PNC=true npm run test:file features/068*
```

### Configuration parameters

The most commonly used parameters are:

| Parameter                       | Description                                                                                                                                                                                  | Default                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| AUDIT_LOG_API_KEY               | The API key for the audit log                                                                                                                                                                | xxx                                |
| AUDIT_LOG_API_URL               | The URL for the audit log                                                                                                                                                                    | http://localhost:7010              |
| AUDIT_LOG_DYNAMODB_EVENTS_TABLE | The table name for audit logging events                                                                                                                                                      | audit-log                          |
| AUDIT_LOG_DYNAMODB_REGION       | The region to use for Dynamo audit log table                                                                                                                                                 | eu-west-2                          |
| AUDIT_LOG_DYNAMODB_TABLE        | The table name for audit logging                                                                                                                                                             | audit-log                          |
| AUTH_TYPE                       | How the tests authenticate against Bichard.<br>If set to `user-service` they will log in as normal.<br>If set to `bichard-jwt` they will set the JWT token and go directly to Bichard        | user-service                       |
| AWS_URL                         | The endpoint to use for the S3 buckets and the Dynamo connection                                                                                                                             |                                    |
| CLEAR_RECORDINGS                | Whether to clear the screenshots of the tests                                                                                                                                                | false                              |
| DB_HOST                         | The host to use for the database connection                                                                                                                                                  | localhost                          |
| DB_PASSWORD                     | The password to use for the database connection                                                                                                                                              | password                           |
| DB_PORT                         | The port to use for the database connection                                                                                                                                                  | 5432                               |
| DB_SSL                          | Whether to use SSL for the database connection                                                                                                                                               | false                              |
| DB_USER                         | The user name to use for the database connection                                                                                                                                             | bichard                            |
| HEADLESS                        | Whether to run puppeteer in headless mode                                                                                                                                                    | true                               |
| MESSAGE_ENTRY_POINT             | If set to `mq` it will send directly to the Bichard message queue.<br>If set to `s3` it will write to the incoming messages bucket and go through the incoming message handler step function | s3                                 |
| MQ_PASSWORD                     | The password to use for the ActiveMQ connection                                                                                                                                              | failover:(stomp://localhost:61613) |
| MQ_URL                          | The URL to use for the ActiveMQ connection                                                                                                                                                   | failover:(stomp://localhost:61613) |
| MQ_USER                         | The user name to use for the ActiveMQ connection                                                                                                                                             | failover:(stomp://localhost:61613) |
| PNC_HOST                        | The host name of the PNC emulator                                                                                                                                                            | localhost                          |
| PNC_PORT                        | The port of the PNC emulator                                                                                                                                                                 | 3000                               |
| RECORD                          | Whether to record the UI operations as screenshots in the `screenshots` folder                                                                                                               | false                              |
| S3_INCOMING_MESSAGE_BUCKET      | The bucket to use to write to the incoming message handler                                                                                                                                   | incoming-messages                  |
| S3_PHASE_1_BUCKET               | The bucket to use to write to phase 1 Conductor                                                                                                                                              | phase1                             |
| S3_REGION                       | The region to use for S3                                                                                                                                                                     | eu-west-2                          |
| TEST_TIMEOUT                    | How long the tests should wait before failing                                                                                                                                                | 30 (seconds)                       |
| TOKEN_SECRET                    | The secret to use for the JWT token                                                                                                                                                          | OliverTwist                        |
| UI_HOST                         | Which host to use to access the UI.                                                                                                                                                          | localhost                          |
| UI_PORT                         | Which port to use to access the UI.                                                                                                                                                          | 4443                               |
| UI_SCHEME                       | Which scheme to use to access the UI.                                                                                                                                                        | https                              |

There are other, lesser used parameters:

| Parameter               | Description                                                                              | Default |
| ----------------------- | ---------------------------------------------------------------------------------------- | ------- |
| NO_UI                   | Performs checks directly against the database iinstead of using the UI                   | false   |
| PNC_TEST_TOOL           | The URL for the PNC test tool on pre-prod                                                |         |
| REAL_PNC                | Used to indicate that the tests are running against a real PNC instead of the emulator   | false   |
| RECORD_COMPARISONS      | Whether to save the comparison files for the test                                        | false   |
| RUN_PARALLEL            | Whether the tests are running in parallel (experimental)                                 | false   |
| SKIP_PNC_VALIDATION     | Whether the tests should validate their operations against the PNC test tool (see below) | false   |
| UPDATE_PNC_EXPECTATIONS | Whether to update the before and after files with the PNC contents                       | false   |

### Debugging

To watch the tests running in a browser, run:

```bash
HEADLESS=false npm run test:local
```

If you want to take screenshots of the browser as the tests run, you can add `RECORD=true` as an environment variable. The screenshots go in a unique folder within the `screenshots` directory. If your tests fail it will print out which folder the screenshots for that specific test are in.

### VS Code Extension

We use [Cucumber (Gherkin) Full Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete).

With these settings:

```json
{
  "cucumberautocomplete.steps": ["packages/e2e-test/steps/*.ts", "steps/*.ts"],
  "cucumberautocomplete.strictGherkinCompletion": true,
  "cucumberautocomplete.formatConfOverride": {
    "And": 3,
    "But": "relative"
  }
}
```

If you don't have syntax highlighting you may have to change your theme. For example, if you have install the Ruby Language Server, search "Theme" and select "Text Editor" and change this setting:

![Editor > Semantic Highlighting](docs/theme.png)
