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
