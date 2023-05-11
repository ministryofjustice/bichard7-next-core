# Bichard 7 API

The bichard7 api acts as a single point of access for the database.

## Endpoints

---

### GET /health

---

Endpoint for checking the application is running

If succesful will return a 200

### GET /courts-cases

---

Returns a list of court cases filtered by the following parameters

| Attribute           | Type                                     | Required |
| ------------------- | ---------------------------------------- | -------- |
| forces              | string []                                | Yes      |
| maxPageItems        | number 10 - 100                          | Yes      |
| allocatedToUserName | string                                   | No       |
| caseState           | enum [Resolved, Unresolved and resolved] | No       |
| courtDateRange      | Array { from: dateTime, to: dateTime }   | No       |
| courtName           | string                                   | No       |
| defendantName       | string                                   | No       |
| locked              | boolean                                  | No       |
| order               | enum [asc, desc]                         | No       |
| orderBy             | string                                   | No       |
| pageNum             | number                                   | No       |
| ptiurn              | string                                   | No       |
| reasonCode          | string                                   | No       |
| reason              | string []                                | No       |
| resolvedByUserName  | string                                   | No       |
| urgent              | enum [Urgent, Non-urgent]                | No       |

If succesful will return 200 and the following response attributes:

| Attribute  | Type        |
| ---------- | ----------- |
| result     | courtCase[] |
| totalCases | number      |

Example request:

```bash
curl http://localhost:3333/court-cases?forces%5B0%5D=01&maxPageItems=10&allocatedToUserName=username&caseState=Resolved&courtDateRange%5B0%5D%5Bfrom%5D=2023-05-02T15%3A06%3A58.412Z&courtDateRange%5B0%5D%5Bto%5D=2023-05-02T15%3A06%3A58.412Z&courtName=courtName&defendantName=defendantName&locked=false&order=asc&orderBy=defendantName&pageNum=1&ptiurn=ptirun&reasonCode=reason&reasons%5B0%5D=Bails&resolvedByUsername=username&urgent=Urgent
```

Example response:

```json
{
  "result": [],
  "totalCasses": 0
}
```
