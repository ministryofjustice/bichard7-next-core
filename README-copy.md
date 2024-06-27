# Bichard 7 Core

The code to replace the processing of messages containing hearing outcomes from the Courts to the Police in Bichard 7.

## Getting started

### Pre-requisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
- [aws-vault](https://github.com/99designs/aws-vault)
- [Docker desktop](https://www.docker.com/products/docker-desktop/)
- [jq](https://stedolan.github.io/jq/download/)

This project has a number of external dependencies that need building in order to run the whole stack.

1. Checkout the following repositories and build each project by running the corresponding Make command:
   1. [Audit Logging](https://github.com/ministryofjustice/bichard7-next-audit-logging) - `make build-api-server build-event-handler-server`
   1. [BeanConnect](https://github.com/ministryofjustice/bichard7-next-beanconnect) - `make build`
   1. [Bichard7 Liberty](https://github.com/ministryofjustice/bichard7-next) - `make build`
   1. [Docker Images](https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images) - `SKIP_GOSS=true make build-local`
   1. [PNC Emulator](https://github.com/ministryofjustice/bichard7-next-pnc-emulator) - `make build`
   1. [User Service](https://github.com/ministryofjustice/bichard7-next-user-service) - `make build`
2. Run Bichard.

```bash
aws-vault exec bichard7-shared -- npm run all
```
