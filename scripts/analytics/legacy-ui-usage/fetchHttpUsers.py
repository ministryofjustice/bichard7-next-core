import os as os
import pandas as pd
import subprocess
from datetime import datetime, timedelta
from fetchAuthProxyLogs import fetchAuthProxyLogs


hourInterval = int(os.environ.get('HOUR_INTERVAL', 3))

today = datetime.today()
start_timestamp = (today - timedelta(hours=hourInterval)
                   ).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
end_timestamp = today.strftime('%Y-%m-%dT%H:%M:%S.%fZ')

data = fetchAuthProxyLogs(start_timestamp, end_timestamp,
                          "GET /forces.png?forceID", "404", "http://")  # NOSONAR - "Using http protocol is insecure. Use https instead" - we are not making a request, but fetching CW logs for http requests
resultData = data['results']

f = open("rawData.json", "w")
f.write(str([i[1] for i in resultData]))
f.close()

filteringRawData = '''
cat rawData.json | grep -oE 'forceID[^[:space:]]+' | sort | uniq > httpUsers.txt
sed -i '' 's/forceID=//g' httpUsers.txt
sed -i '' 's/userID=//g' httpUsers.txt
'''

subprocess.call(filteringRawData, shell=True)
data = pd.read_csv('httpUsers.txt', sep="&",  header=None,
                   names=["forceID", "userID"])
print(
    f'Number of users using the old URL in the last {hourInterval} hours, see httpUsers.xlsx:', len(data))
data.to_excel('httpUsers.xlsx')
