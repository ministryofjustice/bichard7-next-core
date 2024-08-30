# bichard7-next-ui

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the requirements:

```shell
npm i --dev
npm run install:assets
```

Then, run the development server:

```shell
npm run dev
```

Open [http://localhost:4080/bichard](http://localhost:4080/bichard) with your browser to see the Bichard7 UI. Database and a valid auth token is required to be able to browse the service locally.

### Running the database, user-service and nginx-auth-proxy

To spin up a local instance of the database, user-service and auth proxy, you can use the following `npm run ui` command in the [bichard7-next-core](https://github.com/ministryofjustice/bichard7-next-core):

```shell
$ cd /path/to/bichard7-next-core
$ npm run ui
```

Once the dependencies have run follow these login instruction:

1. Navigate to the User Service at [https://localhost:4443/users/](https://localhost:4443/users/) and sign in:
   > User: e.g bichard01@example.com, Pass: password
   > You can grab the 2fa code out of the local Bichard database on the users table under the `email_verification_code` column
1. After signing in, you should see the User Service home page. An `.AUTH` cookie is generated for localhost, so now you can access Bichard7 UI on [http://localhost:4080/bichard](http://localhost:4080/bichard)

## Development

### Layout

| Directory  | Purpose                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| components | Generic reusable components which can be used anywhere within our application |
| features   | Non-generic components which relate to one or more pages                      |
| pages      | Each top-level next.js page which can be visited                              |
| types      | Shared types for typescripting                                                |
| middleware | Code run by our next.js while rendering our pages                             |
| services   | Data access and transformations                                               |

## Testing

To run the tests, ensure that you have a local postgres instance running (run `npm run ui` from the `bichard7-next-core` repo),
then run `npm run test` in this repo

### Unit Testing

#### Code-based

To run code-based (non-visual, no components get rendered) unit tests, run

```bash
    npm run test:unit
```

### Integration/E2e Testing

#### Integration

Code-based integration tests to be run alongside the bichard7-next `postgres` instance

```bash
    npm run test:integration
```

#### E2E

Browser-based E2E `cypress` tests to be run alongside:

To run the `cypress` tests against this, run:

```bash
    npm run cypress:open:docker
```

or if you're running the UI locally (`npm run dev` - will require you to kill the UI docker container first):

```bash
    npm run cypress:open
```
