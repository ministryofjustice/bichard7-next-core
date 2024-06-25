# Analytics scripts 

There are some python scrips to get insight into how users use the legacy Bichard UI. 
- `allocatedCases.py` can show the number of allocated cases per forces for a given time interval
  - Pulls logs from CloudWatch that matches the search terms "allocated exception id:" or "allocated trigger id:"
  - Queries the PG database to get the number of cases in that period
  - Outputs the result in a spreadsheet and generates a bar chart using `plotly.express`
- `search.py` can show the number of times different search boxes used
  - Pulls search data from CloudWatch 
  - Queries the DynamoDB for `user.logged-in'` audit log events to get active users for a force in that period
  - Outputs the result in a spreadsheet
- `filters.py` can show the number of times different filters used
  - Pulls search data from CloudWatch
  - Queries the DynamoDB for `user.logged-in'` audit log events to get active users for a force in that period
  - Outputs the result in a spreadsheet
- `fetchHttpUsers.py` can show the number of users accessing Bichard via the old psn url
  - Pulls data from CloudWatch
  - By default it will query the last 3 hours, you can pass a optional parameter `HOUR_INTERVAL` to specify a different time period 
  - Queries the nginx logs for users still using the old url
  - Outputs the result in a spreadsheet
- `reportRunStats.py` can show the number of times reports generated per users/forces and combined for a given time interval
  - Queries the DynamoDB for `report-run'` audit log events
  - Queries the PG database to get the users' forces
  - Requests forces data from the standing data repo to display full force names instead of codes
  - Outputs the result in a spreadsheet

### Usage
Install packages:
```
pipenv install 
```

Run `allocatedCases.py` script:
- Before running this script connect to the production VPN and set the `CONNECTION_STRING` env variable for PG database.
- Then run:
  ```
  aws-vault exec qsolution-production -- pipenv run python3 allocatedCases.py
  ```

Run `search.py` script:
```
aws-vault exec qsolution-production -- pipenv run python3 search.py
```

Run `filters.py` script:
```
aws-vault exec qsolution-production -- pipenv run python3 filters.py
```

Run `fetchHttpUers.py` script:
```
aws-vault exec qsolution-production -- pipenv run python3 fetchHttpUsers.py // default 3 hours with no parameter 
```
You can specify a longer time frame by passing the enviroment variable `HOUR_INTERVAL` 
```
HOUR_INTERVAL=36 aws-vault exec qsolution-production -- pipenv run python3 fetchHttpUsers.py
```

Run `reportRunStats.py` script:
- Before running this script connect to the production VPN and set the `CONNECTION_STRING` env variable for PG database.
- Then run:
  ```
  aws-vault exec qsolution-production -- pipenv run python3 reportRunStats.py
  ```
