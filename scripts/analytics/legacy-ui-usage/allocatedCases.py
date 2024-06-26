import pandas as pd
import plotly.express as px
import json
import psycopg2
from datetime import datetime, timedelta
import os
from fetchLogs import fetchLogs

conn_string = os.getenv('CONNECTION_STRING')
daysInterval = int(os.environ.get('DAYS_INTERVAL', 7))

today = datetime.today()
start_timestamp = (today - timedelta(days=daysInterval)
                   ).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
end_timestamp = today.strftime('%Y-%m-%dT%H:%M:%S.%fZ')


def fetchNumberOfCasesForForce(conn, daysInterval, forceCode):
    cur = conn.cursor()
    cur.execute(f"""SELECT org_for_police_filter, COUNT(*)
                FROM "br7own"."error_list"
                WHERE create_ts BETWEEN current_timestamp - interval '{daysInterval} days' AND current_timestamp
                AND org_for_police_filter LIKE '%{forceCode}%'
                AND(trigger_count > 0
                     OR error_count > 0)
                GROUP BY org_for_police_filter
                LIMIT 10000 OFFSET 0
                """)
    results = cur.fetchall()
    return sum(map(lambda x: x[1], results))


def getAllocationRecord(logMessage, caseType):
    allocator = logMessage.split(' allocated')[0]
    caseID = logMessage.split('id: ')[1].split(' to ')[0]
    handler = logMessage.split('id: ')[1].split('user: ')[1].split(' from ')[0]
    return {
        "caseID": caseID,
        "allocator": allocator,
        "handler": handler,
        "caseType": caseType
    }


def fetchAllocations(keyword, caseType, dest):
    data = fetchLogs(start_timestamp, end_timestamp, keyword)

    for _, record in enumerate(data['results']):
        logMessage = json.loads(record[1]['value'])["message"]
        force = logMessage.split('forces [')[1].split(']')[0]
        allocationRecord = getAllocationRecord(logMessage, caseType)

        if force in dest:
            dest[force].append(allocationRecord)
        else:
            dest[force] = [allocationRecord]
    return dest


allocations = {}
allocations = fetchAllocations(
    "allocated exception id:", 'exception', allocations)
allocations = fetchAllocations(
    "allocated trigger id:", 'trigger', allocations)

allocatedCaseIDsPerForce = {}
for force in allocations:
    for alloc in allocations[force]:
        if force in allocatedCaseIDsPerForce:
            allocatedCaseIDsPerForce[force].append(alloc['caseID'])
        else:
            allocatedCaseIDsPerForce[force] = [alloc['caseID']]

conn = psycopg2.connect(conn_string)

numberOfAllocationsPerForce = {}

for force in allocatedCaseIDsPerForce:
    uniqAllocations = len(set(allocatedCaseIDsPerForce[force]))
    allAllocations = len(allocatedCaseIDsPerForce[force])
    numberOfAllCases = fetchNumberOfCasesForForce(
        conn, daysInterval, force.lstrip('0'))
    numberOfAllocationsPerForce[force] = {
        "force": force,
        "Uniq allocations": uniqAllocations,
        "allAllocations": allAllocations,
        "All cases": numberOfAllCases,
        "Percentage": round((allAllocations / numberOfAllCases) * 100, 2),
        "Percentage of uniq allocations": (uniqAllocations / numberOfAllCases) * 100
    }

conn.close()

df = pd.DataFrame.from_dict(numberOfAllocationsPerForce, orient='index')
df.to_excel('allocatedCases.xlsx')
fig = px.bar(df, x="force", y=["Uniq allocations", "All cases"], hover_data=[
             "Percentage of uniq allocations"], labels={
    "force": "Forces",
}, title="Percentage of allocated cases per force", barmode='stack')
fig.show()
