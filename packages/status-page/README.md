# Status Page

A static web page to display Bichard service health metrics

## Architecture (wip)

- cloudwatch schedule
  - triggers the lambda on a cron schedule
- lambda (python docker container)
  - fetches metric data from cloudwatch
  - maintains tabular historic data in s3
  - replaces `_data/ui_data.json` on each run, this represents the current state for the UI
- html
  - the content of the static site, draws from `_data/ui_data.json`

## Development
UV is used for python version and package management during development (see uv.lock, pyproject.toml, .python-version)
For deployment, pip with requirements.txt is used for package management, and the base image in the dockerfile determines the python version.This is to keep the docker image as lightweight as possible, while allowing simpler development.
