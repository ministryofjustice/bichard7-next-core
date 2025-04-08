---
layout: default
title: How Bichard updates the PNC
---

Bichard 7 receives CJS result codes and result information from Libra and performs some validation checks. If the result passes the validation checks, Bichard 7 then uses the result information to send a PNC update message to the PNC. The update message lets PNC know to update one or more of the following PNC pages: arrest summons, disposal history, remand and defendant alias.

| Result type | PNC fields updated | PNC page | Description |
|-------------|--------------------|----------|-------------|
| All | Court code | Arrest summons, Disposal history, Remand | Identifier for the court |
| All | Court date | Arrest summons, Disposal history, Remand | The Hearing Date         |
| All | Record owner | | All records created by Bichard 7 will be 'owned' by FFYZ, where FF is the force id from the URN/ASN or court and "YZ" is used to indicate Bichard 7. |
| Offence | Plea | Disposal history | Guilty/Not Guilty/No Plea |
| Offence | Adjudication | Disposal history | Guilty/Not Guilty/Non Conviction |
| Offence | Committed on bail | Disposal history | Forced to "N" with trigger if PNC warns us the defendant was on bail |
| Offence | Date of conviction | Disposal history | |
| Offence | Date of sentence | Disposal history | |
| Offence | Offence TIC - Number | Disposal history | Number of Offences taken into account |
| Disposal | Disposal qualifiers | Disposal history | Up to 4 two letter qualifiers as received from Libra |
| Disposal | Disposal quantity | Disposal history | Used to hold the Sentence (e.g. 2 years, Life, etc) or the fine/cost,etc. amount depending on the result code |

