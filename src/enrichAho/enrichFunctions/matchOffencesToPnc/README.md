# Offence matching algorithm

Bichard receives court results and needs to update offences on the PNC with these results.
Unfortunately, for unknown reasons, the ID to use on the PNC for updating is not included in the message from the court. This means that we need to work out which offence in the PNC matches which offence in the court result. There are some complications to this, however:

- Offences may be added in the court
- The data for offences coming from the courts may not match those in the PNC
- There may be offences with identical details (date, offence code, etc)
- Offences from the court may be from two separate court cases in the PNC

The original algorithm in Bichard to do this matching was extremely complex. We are aiming to simplify it. The new algorithm tries to match the offences in multiple stages:

### 1. Try to match all offences exactly in one court case

If there are exact matches (sequence number, offence code, dates) for every offence in a hearing outcome in a single court case, and all offences are matched, then we will accept these as correct matches. e.g.

#### Hearing Outcome Offences

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88218      | 2022-07-19 |          | 2063         |
| 002             | TH68143      | 2022-07-19 |          | 4028         |

#### PNC Offences

Court Case Number: 22/2041/111111X

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88218      | 2022-07-19 |          | 2063         |
| 002             | TH68143      | 2022-07-19 |          | 4028         |

Court Case Number: 22/2041/222222Y

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88218      | 2022-07-19 |          | 2063         |

#### Matches

| HO Offence | PNC Offence | PNC Court Case  |
| ---------- | ----------- | --------------- |
| 001        | 001         | 22/2041/111111X |
| 002        | 002         | 22/2041/111111X |

### 2. Try to match all offences exactly across multiple court cases

If there are exact matches (sequence number, offence code, dates) for every offence in a hearing outcome across multiple court cases, and all offences are matched, then we will accept these as correct matches. e.g.

#### Hearing Outcome Offences

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88334      | 2022-07-19 |          | 2063         |
| 002             | TH68143      | 2022-07-19 |          | 4028         |

#### PNC Offences

Court Case Number: 22/2041/111111X

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88218      | 2022-07-19 |          | 2063         |
| 002             | TH68143      | 2022-07-19 |          | 4028         |

Court Case Number: 22/2041/222222Y

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88334      | 2022-07-19 |          | 2063         |

#### Matches

| HO Offence | PNC Offence | PNC Court Case  |
| ---------- | ----------- | --------------- |
| 001        | 001         | 22/2041/222222Y |
| 002        | 002         | 22/2041/111111X |

### 3. Try to match again ignoring the sequence numbers but with exact dates, prioritising a single court case with all matches

If there are matches (offence code, dates) for every offence in a hearing outcome in a single court case, and all offences are matched, then we will accept these as correct matches. e.g.

#### Hearing Outcome Offences

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 003             | RT88218      | 2022-07-19 |          | 2063         |
| 004             | TH68143      | 2022-07-19 |          | 4028         |

#### PNC Offences

Court Case Number: 22/2041/111111X

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88218      | 2022-07-19 |          | 2063         |
| 002             | TH68143      | 2022-07-19 |          | 4028         |

Court Case Number: 22/2041/222222Y

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88218      | 2022-07-19 |          | 2063         |

#### Matches

| HO Offence | PNC Offence | PNC Court Case  |
| ---------- | ----------- | --------------- |
| 003        | 001         | 22/2041/111111X |
| 004        | 002         | 22/2041/111111X |

### 4. Try to match again ignoring the sequence numbers but with exact dates, acros multiple court cases

If there are matches (offence code, dates) for every offence in a hearing outcome across multiple court cases, and all offences are matched, then we will accept these as correct matches. e.g.

#### Hearing Outcome Offences

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 003             | RT88334      | 2022-07-19 |          | 2063         |
| 004             | TH68143      | 2022-07-19 |          | 4028         |

#### PNC Offences

Court Case Number: 22/2041/111111X

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88334      | 2022-07-19 |          | 2063         |
| 002             | TH68143      | 2022-07-19 |          | 4028         |

Court Case Number: 22/2041/222222Y

| Sequence Number | Offence Code | Start Date | End Date | Result codes |
| --------------- | ------------ | ---------- | -------- | ------------ |
| 001             | RT88334      | 2022-07-19 |          | 2063         |

#### Matches

| HO Offence | PNC Offence | PNC Court Case  |
| ---------- | ----------- | --------------- |
| 003        | 001         | 22/2041/222222Y |
| 004        | 002         | 22/2041/111111X |

Exceptions to raise are:

## HO100304

When the offences from the court don't match with the offences on the PNC

## HO100310

Multiple Court Offences with different Results match a PNC Offence

## HO100311

Duplicate Court Offence Sequence Number

## HO100312

No PNC Offence with this Sequence Number (and it was manually set?)

## HO100320

Sequence number identifies a non-matching Offence (and it was manually set?)

## HO100328

Unable to determine whether fixed penalty or court case should be resulted

## HO100329

Unable to identify correct fixed penalty

## HO100332

Offences match more than one CCR

## HO100333

Manual match detected but no case matches upon resubmission, suggesting ASN updated or PNC data updated manually before resubmission

# Scenarios

## Scenario 1

Multiple matches, but same result code, so it doesn't matter which one matches to which

Incoming Records

003 CJ88159 2023-03-11 4027
004 CJ88159 2023-03-11 4027

PNC Records

AAAA/1234
001 CJ88159 2023-03-11  
002 CJ88159 2023-03-11

Matches
003 -> 001
004 -> 002

## Scenario 2

Multiple matches, but different result code, so we don't know which one matches to which

Incoming Records

003 CJ88159 2023-03-11 4028
004 CJ88159 2023-03-11 4027

PNC Records

AAAA/1234
001 CJ88159 2023-03-11  
002 CJ88159 2023-03-11

Exception HO100304 raised
