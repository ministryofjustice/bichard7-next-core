# Bichard7 vNext: User Service

A Next.js application to provide user authentication and user management within the new Bichard7 architecture.

## Building

AWS CodeBuild automatically builds the user-service Docker image and pushes into the AWS container repository (ECR). The image is built upon the `nodejs` image from our ECR repo.

In order to build the user-service image locally, you'll need to have installed and configured the [AWS CLI](https://aws.amazon.com/cli/) and [`aws-vault`](https://github.com/99designs/aws-vault), so that you can authenticate with AWS and pull down the `nodejs` image from ECR.

You can then run the build process via `aws-vault`:

```shell
$ aws-vault exec bichard7-sandbox-shared -- make build
```

## Running

In order to run the user-service, you'll also need to ensure the Bichard PostgreSQL database is running locally (see [Running the database](#running-the-database) below).

Once you've built the Docker image (see [Building](#building) above) and have the Bichard PostgreSQL database running, you run the Docker image as usual:

```shell
$ docker run -p 3443:443 user-service

# Or, a shortcut to run the above:
$ make run
```

Either of these commands will expose the service at https://localhost:3443/.

### Running the database

To spin up a local instance of the database, you can use the `run-pg` make target in the [main bichard repo](https://github.com/ministryofjustice/bichard7-next):

```shell
$ cd /path/to/bichard7-next
$ make run-pg
```

## Configuration

The application makes use of the following environment variables to permit configuration:

| Variable                         | Default                            | Description                                                                                          |
|----------------------------------|------------------------------------|------------------------------------------------------------------------------------------------------|
| `$AUDIT_LOGGING_URL`             | `"/audit-logging"`                 | The URL to redirect to audit logging                                                                 |
| `$BASE_URL`                      | `"http://localhost:3000"`          | The URL that the user-service is being served from. Used for generating email links.                 |
| `$BICHARD_REDIRECT_URL`          | `"/bichard-ui/InitialRefreshList"` | The URL to redirect to with a token as a GET parameter when authentication is successful             |
| `$COOKIE_SECRET`                 | `"OliverTwist"`                    | The secret to use for signing the cookies                                                            |
| `$COOKIES_SECURE`                | `true`                             | Whether to enable the `Secure` cookie flag (prevents cookies from being sent in non-https requests)  |
| `$CSRF_COOKIE_SECRET`            | `"OliverTwist2"`                   | The secret to use for signing the CSRF cookie token                                                  |
| `$CSRF_FORM_SECRET`              | `"OliverTwist1"`                   | The secret to use for signing the CSRF form token                                                    |
| `$CSRF_TOKEN_MAX_AGE`            | `600`                              | The maximum validity of CSRF tokens in seconds                                                       |
| `$DB_HOST`                       | `"localhost"`                      | The hostname of the database server                                                                  |
| `$DB_USER`                       | `"bichard"`                        | The username to use when connecting to the database                                                  |
| `$DB_PASSWORD`                   | `"password"`                       | The password to use when connecting to the database                                                  |
| `$DB_DATABASE`                   | `"bichard"`                        | The name of the database containing the user information                                             |
| `$DB_PORT`                       | `5432`                             | The port number to connect to the database on                                                        |
| `$DB_SSL`                        | `false`                            | Whether to use SSL when connecting to the database                                                   |
| `$EMAIL_FROM`                    | `"bichard@cjse.org"`               | The email address to send emails from                                                                |
| `$EMAIL_VERIFICATION_EXPIRES_IN` | `30`                               | The number of minutes after which the email verification links will expire                           |
| `$INCORRECT_DELAY`               | `10`                               | The amount of time (in seconds) to wait between successive login attemps for the same user           |
| `$REMEMBER_EMAIL_MAX_AGE`        | `1440`                             | The maximum validity of cookie for remembering user's email address in minutes                       |
| `$SMTP_HOST`                     | `"console"`                        | The hostname of the SMTP server. If set to `console`, emails will be printed to the console instead. |
| `$SMTP_USER`                     | `"bichard"`                        | The username to use when connecting to the SMTP server                                               |
| `$SMTP_PASSWORD`                 | `"password"`                       | The password to use when connecting to the SMTP server                                               |
| `$SMTP_PORT`                     | `587`                              | The port number to connect to the SMTP server on                                                     |
| `$SMTP_TLS`                      | `false`                            | Whether to use TLS when connecting to the SMTP server                                                |
| `$TOKEN_EXPIRES_IN`              | `"60 seconds"`                     | The amount of time the tokens should be valid for after issuing                                      |
| `$TOKEN_ISSUER`                  | `"Bichard"`                        | The string to use as the token issuer (`iss`)                                                        |
| `$TOKEN_SECRET`                  | `"OliverTwist"`                    | The HMAC secret to use for signing the tokens                                                        |

These can be passed through to the docker container with the `-e` flag, for example:

```shell
$ docker run \
   -p 3443:443 \
   -e TOKEN_SECRET="SECRET" \
   -e TOKEN_EXPIRES_IN="10 seconds" \
   user-service
```

### Configuring the database connection

The user-service requires a connection to the Bichard PostgreSQL database. The defaults for the database connection parameters are set up to work when the user-service is running locally (see [Running the app locally](#running-the-app-locally) below).

However, this means that if you're running the user-service inside Docker, you'll need to pass through the `$DB_HOST` environment variable to configure the database connection:

```shell
$ cd /path/to/bichard7-next-user-service
$ docker run \
   -p 3443:443 \
   -e DB_HOST=172.17.0.1 \
   user-service

# Or, a shortcut to run the above:
$ make run
```

To customise other database connection parameters, see the `$DB_*` parameters in [the table above](#Configuration). The other database configuration defaults should be sufficient for connceting to a local instance of the database.

### SSL Certificates

The Docker image is configured to run NGINX in front of the Next.js application, to allow us to do SSL termination.

A self-signed certificate is generated and included in the Docker image, but this can be overridden by mounting a different certificate and key at `/certs/server.{crt,key}`:

```shell
$ docker run \
   -p 3443:443 \
   -v /path/to/your/certificates:/certs \
   user-service
```

## Development

### Installing requirements

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to allow you to use/switch between node versions

1. Install and use the version of node specified by this project:
   ```shell
   $ cd /path/to/bichard7-next-user-service
   $ nvm install
   ```

1. Install the npm dependencies:
   ```shell
   $ npm install
   ```

1. Copy the GOV.UK frontend assets from the installed package into the location that Next.js serves static files from:
   ```shell
   $ npm run install:assets
   ```

1. Install the [husky](https://typicode.github.io/husky/) git hooks to automatically lint the code:
  ```shell
  $ npm run install:hooks
  ```

### Running the app locally

The application can be started in development mode, which includes features such as extra error reporting and hot-code reloading, by running:

```shell
$ npm run dev
```

Alternatively, an optimized production build of the application can be built and then served with:

```shell
$ npm run build
$ npm run start
```

### Testing

There are a number of different types of test that form part of the user-service testing suite:

- **Unit tests:** tests for validating the logic of individual functions and components of the service, written using [Jest](https://jestjs.io/).
  ```shell
  $ npm run test:unit
  ```

- **Integration tests:** tests for validating the higher-level behaviour, or use cases, of the service. These are again written using [Jest](https://jestjs.io/), and require [a database connection](#running-the-database).
  ```shell
  $ npm run test:integration
  ```

- **UI tests:** tests that drive the service interface within a web browser using [Cypress](https://www.cypress.io/), to validate the interface and interactions from a user perspective. Also requires [a database connection](#running-the-database).
  ```shell
  # Build a production copy of the app and run all of the UI tests against it
  $ npm run test:ui

  # Build a production copy of the app and run one or more of the UI tests against it
  $ npm run test:ui cypress/e2e/login.cy.js
  $ npm run test:ui login.cy.js users.cy.js

  # Run the UI tests against a version of the app that is already running
  $ npm run cypress:run

  # Open the cypress UI for better test debugging
  $ npm run cypress:open
  ```

- **Docker image tests:** tests to validate the user-service docker container, using [Goss](https://github.com/aelsabbahy/goss/tree/master/extras/dgoss). Requires `goss` and `dgoss` to be installed (see instructions in their READMEs, [here](https://github.com/aelsabbahy/goss#installation) and [here](https://github.com/aelsabbahy/goss/tree/master/extras/dgoss)).
  ```shell
  # Build the user-service docker container
  $ aws-vault exec bichard7-sandbox-shared -- make build

  # Run the goss tests
  $ make goss
  ```

#### Snapshot testing for React components

Snapshot testing of React components is implemented as part of the [unit tests](#testing) for the app. Snapshot testing is where the markup generated by a React component is compared to a static snapshot of the expected markup. It's a very useful tool for validating that your UI does not change unexpectedly.

When you make changes in a React component that results in changes to the DOM nodes, the following might have happened:
- Changes you made have changed the behavior of the component that you didn't expect: **Update the code until test passes**
- Changes you made have changed the behavior of the component that is as expected: **Update the snapshot**

To update snapshots run the following command:

```shell
npm run test:unit:update
```

Check the snapshot before pushing it to the repository to ensure that the generated markup is as you expect.

For more details, check [Jest documentation](https://jestjs.io/docs/snapshot-testing) and [React testing library](https://testing-library.com/docs/react-testing-library/api/#render).

### Code formatting

This project utilises [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to code linting and auto-formatting. They are run as part of a pre-commit git hook, as well as in the CI.

To run them manually without making any auto-corrections, you can use:

```shell
$ npm run lint
```

And similarly, to run them and make any possible auto-corrections, use:

```shell
$ npm run lint:fix
```
