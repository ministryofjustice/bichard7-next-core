import json
import pandas as pd
from fetchLogs import fetchLogs
from fetchLoginLogs import fetchLoginLogs

start_timestamp = '2023-01-30T00:00:00.000Z'
end_timestamp = '2023-01-31T00:00:00.000Z'
data = fetchLogs(start_timestamp, end_timestamp, " search used by ")

# ### Search logs
searches = {'Defendant': {}, 'Reason': {}, 'Court': {}, 'View my records': {}}

for i, record in enumerate(data['results']):
    logMessage = json.loads(record[1]['value'])["message"]
    searchType = logMessage.split(' search used by ')[0]
    user = logMessage.split(' search used by ')[1].split(' from forces ')[0]
    forces = logMessage.split(' search used by ')[1].split(
        ' from forces ')[1].strip('[]')
    if (forces in searches[searchType]):
        searches[searchType][forces].append(user)
    else:
        searches[searchType][forces] = [user]

# Login logs for active users:
response = fetchLoginLogs(start_timestamp, end_timestamp)

activeUsersPerForce = {}

for loginRecord in response['Items']:
    username = loginRecord['attributes']['M']['user']['M']['username']['S']
    inclusionList = loginRecord['attributes']['M']['user']['M']['inclusionList']['L'][0]['S']
    if inclusionList in activeUsersPerForce:
        activeUsersPerForce[inclusionList].add(username)
    else:
        activeUsersPerForce[inclusionList] = {username}

stats = {}
for searchType in searches:
    timesUsedSearchLabel = f'Times used {searchType} search'
    usersUsedSearchLabel = f'Users used {searchType} search'
    percentageUsedSearchLabel = f'% used {searchType} search'
    for force in searches[searchType]:
        # In case there are more than one
        firstForceCode = force.split(', ')[0]
        activeUsersOnDay = len(activeUsersPerForce[firstForceCode])
        numberOfUsersUsedSearch = len(set(searches[searchType][force]))
        numberOfTimesUsedSearch = len(searches[searchType][force])
        percentageUsedSearch = round(
            (numberOfUsersUsedSearch / activeUsersOnDay) * 100, 2)
        if firstForceCode in stats:
            stats[firstForceCode][timesUsedSearchLabel] = numberOfTimesUsedSearch
            stats[firstForceCode][usersUsedSearchLabel] = numberOfUsersUsedSearch
            stats[firstForceCode][percentageUsedSearchLabel] = f'{percentageUsedSearch}%'
        else:
            stats[firstForceCode] = {
                'Active users': activeUsersOnDay,
                timesUsedSearchLabel: numberOfTimesUsedSearch,
                usersUsedSearchLabel: numberOfUsersUsedSearch,
                percentageUsedSearchLabel: f'{percentageUsedSearch}%',
            }

df = pd.DataFrame.from_dict(stats, orient='index')
df.to_excel('searches.xlsx')
