# Bichard 7 API<!-- omit from toc -->

The Bichard7 API acts as a single point of access for the database and conductor.

## Contents<!-- omit from toc -->

- [Setup](#setup)
- [Building](#building)
- [Docker](#docker)
- [Endpoints](#endpoints)
- [Structure of folders and files](#structure-of-folders-and-files)
  - [Tests](#tests)
  - [Files and Folders](#files-and-folders)
  - [Plugins](#plugins)
  - [Routes](#routes)

## Setup

Install NPM dependencies from the top level of this repo `npm ci`

Then from this directory run `npm run server:dev`

## Building

Go to the top level and run `npm run build:api`. This will build all the dependencies and the API.

If you make changes in `packages/common` you need to stop the running server and rebuild `common`. The easiest way of
doing this is to `cd packages/common` and run `npm run watch`. This will rebuild on any change. If you're running the
dev server it's easy not to remember to restart the dev server. Your changes in `common` will not be related until to
you restart the dev server.

## Docker

To build a Docker image:

- Go to the top level of this repo
- Run this command `./scripts/build-api-docker.sh`

## Endpoints

See the Swagger Documentation at:

- Docker <http://localhost:3333/swagger>
- Dev server: <http://localhost:3321/swagger>

## Structure of folders and files

Fastify allows you to create "plugins" and you can auto load the folder you want. See the `health` plugin for an
example.

### Tests

Tests next to the files that they test. We have `.unit.test.ts` and/or `.integration.test.ts` files. Files with `.e2e.test.ts`
interact with the Database and will wipe the Users, Error List, Notes and Trigger tables.

### Files and Folders

- Index starts the Fastify instance after it has been built
- App is the "builder" for the orchestration of Fastify
  - Server folder the creation the Fastify server, auth, logging and Swagger config
  - Contains the auto loader for Plugins and Routes
- Services for things that help operate the API e.g. the database config and connection
- useCases for a use case, that will be business logic.

### Plugins

The `src/plugins` folder does not require any authentication. So anything we want to be loaded that does not require
authentication should go in here.

See `plugins/health` folder to see a complex break down of how you should organise an endpoint.

### Routes

The `src/routes` folder does not require authentication. See the Swagger documentation to test the "Authorize" button.
In development you need to log in to the User Service and copy the `.AUTH` cookie. This is the JWT. We need to copy/paste
the JWT so we can enter `Bearer $JWT`.
