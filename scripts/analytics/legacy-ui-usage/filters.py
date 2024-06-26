import json
import pandas as pd
from fetchLogs import fetchLogs
from fetchLoginLogs import fetchLoginLogs


def orderCodes(codes):
    code_list = [code for code in codes.split(', ')]
    sorted_codes = sorted(code_list)
    return ', '.join([code for code in sorted_codes])


start_timestamp = '2023-03-01T00:00:00.000Z'
end_timestamp = '2023-03-15T00:00:00.000Z'

# filter usage logs
data = fetchLogs(start_timestamp, end_timestamp, " filter used by ")
filters = {}

for i, record in enumerate(data['results']):
    logMessage = json.loads(record[1]['value'])["message"]
    filterType = logMessage.split(' filter used by ')[0]
    user = logMessage.split(' filter used by ')[1].split(' from forces ')[0]
    unorderedForceCodes = logMessage.split(
        ' from forces ')[1].split(' value')[0].strip('[]')

    if (unorderedForceCodes == None or unorderedForceCodes == ""):
        forces = "No force"
    else:
        forces = orderCodes(unorderedForceCodes)

    if (filterType not in filters):
        filters[filterType] = {}

    if (forces in filters[filterType]):
        filters[filterType][forces].append(user)
    else:
        filters[filterType][forces] = [user]

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
for filterType in filters:
    timesUsedFilterLabel = f'Times used {filterType} filter'
    usersUsedFilterLabel = f'Users used {filterType} filter'
    percentageUsedFilterLabel = f'% used {filterType} filter'
    for force in filters[filterType]:
        forces = force.split(', ')
        activeUsersOnDay = 0

        for code in forces:
            activeUsersOnDay = activeUsersOnDay + \
                len(activeUsersPerForce.get(code) or [])

        numberOfUsersUsedFilter = len(set(filters[filterType][force]))
        if activeUsersOnDay < numberOfUsersUsedFilter:
            print(
                f'User login missing our outside of the time-frame for force: {force}')
            # Sometimes users logged in earlier therefore there are less active users in login logs,
            # taking the number of users from usage logs as active users
            activeUsersOnDay = numberOfUsersUsedFilter

        numberOfTimesUsedFilter = len(filters[filterType][force])
        percentageUsedFilter = round(
            (numberOfUsersUsedFilter / activeUsersOnDay) * 100, 2)
        if force in stats:
            stats[force][timesUsedFilterLabel] = numberOfTimesUsedFilter
            stats[force][usersUsedFilterLabel] = numberOfUsersUsedFilter
            stats[force][percentageUsedFilterLabel] = f'{percentageUsedFilter}%'
        else:
            stats[force] = {
                'Active users': activeUsersOnDay,
                timesUsedFilterLabel: numberOfTimesUsedFilter,
                usersUsedFilterLabel: numberOfUsersUsedFilter,
                percentageUsedFilterLabel: f'{percentageUsedFilter}%',
            }

df = pd.DataFrame.from_dict(stats, orient='index')
df.to_excel('filters.xlsx')
