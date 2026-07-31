# Status Page

A web page to display Bichard service health metrics

## Architecture (wip)

- cloudwatch schedule
  - triggers the lambda on a cron schedule
- lambda (containerised python function)
  - fetches metric data from cloudwatch
  - appends to tabular historic data in s3
  - recreates a json file on each run, this represents the current state, formatted for the UI
- html
  - the content of the web page, uses embedded Javascript to read the json file updated by the lambda


## Development

UV is used for python version and package management (see uv.lock, pyproject.toml, .python-version). To recreate the environment, ensure uv is installed on your machine, and run `uv sync`.

Make is used as a task runner, and the makefile provides tasks for common development activities e.g. building and pushing the container to ECR
