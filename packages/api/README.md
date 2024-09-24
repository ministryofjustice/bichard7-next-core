# Bichard 7 API

The Bichard7 API acts as a single point of access for the database and conductor.

## Setup

Install NPM dependencies from the top level of this repo `npm i --workspaces --include-workspace-root`

Then from this directory run `npm run server:dev`

## Building

You shouldn't need to manually build this package the dev server takes care of building, server and auto-building after
a change.

## Docker

To build a Docker image:

- Go to the top level of this repo
- Run this command `./scripts/build-api-docker.sh`

Docker uses esbuild to compile and transform TypeScript into JavaScript.

## Endpoints

See the Swagger Documentation at:

- Docker <http://localhost:3333/swagger>
- Dev server: <http://localhost:3321/swagger>

## Structure of folders and files

Fastify allows you to create "plugins" and you can auto load the folder you want. See the `health` plugin for an
example.

### Tests

Tests are in their own folder because we use esbuild and we cannot ignore the tests files. So we have a created a test
directory to store them in.

### Files and Folders

- Index starts the Fastify instance after it has been built
- App is the "builder" for the orchestration of Fastify
  - Server folder the creation the Fastify server, logging and Swagger config
  - Contains the auto loader for Plugins and Routes
- Services

### Plugins

The `src/plugins` folder does not require any authentication. So anything we want to be loaded that does not require
authentication should go in here.

See `plugins/health` folder to see a complex break down of how you should organise an endpoint.

### Routes

The `src/routes` folder does require authentication. See the Swagger documentation to test the "Authorize" button. In
development the key is `Bearer password` and the User's JWT encoded in Base64.
