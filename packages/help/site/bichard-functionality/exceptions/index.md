---
layout: default
title: Exceptions
---

Exceptions occur when the Bichard 7 system cannot automatically update PNC with the court hearing
result. This may be because of an error, or because the result is complex.

There are 2 types of exception:

- **pre hearing outcome publication** <br>
  If errors are found when completing Bichard 7 checks. For example, an invalid ASN may mean the entry cannot be identified on PNC.

- **post hearing outcome publication** <br>
  Where the entry has been correctly identified on PNC but the offence cannot be updated. For example, result may already be on the PNC.

## Case ownership

Forces are responsible for exceptions arising from their own cases. If a case is heard out of area, Bichard 7 will always attempt to pass the case back to the owning force.

If this is not possible, the case will default back to the local force for the court. For example, if the ASN and PTIURN have not been recorded correctly at court.

You can fix and resubmit a case if the correct Force Owner, ASN or PTIURN is available on paperwork or the PNC.

If the exception is straightforward, the force that received it should result the case. Otherwise, send a copy of the register to the owning force and mark the exception as 'Manually Resolved'.

## Exceptions List

Pre Hearing Publication Errors ('validation' errors) - Error Codes & Messages:

| Error ID | Message |
|----------|---------|
| HO100100 | Bad value (general catch-all) |
| HO100101 | Value required (general catch-all) |
| HO100102 | Bad date |
| HO100103 | Bad time |
| HO100104 | Bad timestamp |
| HO100105 | Bad integer |
| HO100106 | Too short (catch-all) |
| HO100107 | Too long (catch-all) |
| HO100108 | Value is not allowed for the field |
| HO100109 | Number too small |
| HO100110 | Number too large |
| HO100111 | Bad decimal |
| HO100200 | Invalid Organisation Unit Code |
| HO100201 | Bad PTI-URN format |
| HO100202 | Bad Case Marker |
| HO100203 | Bad Court Case Reference Number format |
| HO100206 | Bad Arrest Summons Number |
| HO100207 | Bad CRO Number format |
| HO100208 | Bad Driver Number format |
| HO100209 | Bad PNC Identifier format |
| HO100210 | Bad PNC Checkname format |
| HO100211 | Bad Organisation Name format |
| HO100212 | Bad Title |
| HO100213 | Bad Given Name |
| HO100214 | Bad Requested Name |
| HO100215 | Bad Family Name |
| HO100216 | Bad Suffix |
| HO100217 | Bad Address Line |
| HO100219 | Bad Bail Conditions |
| HO100220 | Bad Reason For Bail Conditions |
| HO100224 | Bad Act Or Source (Part of Offence Code) |
| HO100226 | Bad Common Law Offence |
| HO100227 | Bad Reason (Part of Offence Code) |
| HO100228 | Bad Offence Reason Sequence |
| HO100230 | Bad year |
| HO100231 | Bad month |
| HO100232 | Bad Location Of Offence |
| HO100233 | Bad Offence Title (Lookup failed) |
| HO100234 | Bad Wording (Lookup failed) |
| HO100235 | Bad Actual Statement Of Facts |
| HO100236 | Bad Home Office Classification (Lookup failed) |
| HO100237 | Bad Alcohol Level Amount |
| HO100238 | Bad Vehicle Registration Mark |
| HO100239 | Bad Court Offence Sequence Number |
| HO100240 | Bad CJS Result Code |
| HO100241 | Bad Result Applicable Qualifier Code |
| HO100242 | Bad Duration Length |
| HO100243 | Bad Amount Specified In Result amount |
| HO100244 | Bad Number Specified In Result amount |
| HO100245 | Bad Result Variable Text (Must not be empty) |
| HO100246 | Bad PNC Disposal Type |
| HO100247 | Bad Result Qualifier Variable Code |
| HO100248 | Bad Result Qualifier Variable Text |
| HO100249 | Bad Court House Code |
| HO100250 | Bad Area Code (Part of Local Offence Code) |
| HO100251 | Bad Offence Code (Part of Local Offence Code) |
| HO100300 | Organisation not recognised |
| HO100301 | ASN not found on PNC |
| HO100302 | PNC query failed (e.g. communication failure, timeout) |
| HO100304 | Court offences do not match with what is on the PNC |
| HO100305 | Conviction/Hearing dates and/or Verdict do not make sense |
| HO100306 | Offence Code not found (Lookup failed) |
| HO100307 | Result Code not found (Lookup failed) |
| HO100309 | Result Code Qualifier not found (Lookup failed) |
| HO100310 | Multiple Court Offences with different Results match a PNC Offence |
| HO100311 | Duplicate Court Offence Sequence Number |
| HO100312 | No PNC Offence with this Sequence Number |
| HO100313 | PNC Query returned a business error |
| HO100314 | PNC Query returned a system fault (e.g. returned an unexpected error code) |
| HO100315 | PNC Query returned a warning |
| HO100316 | PNC Query returned an invalid Offence Sequence (reference) number |
| HO100317 | PNC Query returned a duplicate Offence Sequence (reference) number |
| HO100318 | PNC Query returned an invalid Court Case Reference number |
| HO100320 | Sequence number identifies a non-matching Offence |
| HO100321 | Dummy ASN not allowed when Offences/Results are recordable |
| HO100322 | Next Result Source Organisation is absent for a remand. |
| HO100323 | Next Hearing Date is absent for a remand. |
| HO100324 | Adjournment pre Judgement but PNC has an adjudication |
| HO100325 | Inconsistent result: Adjournment post Judgement but PNC does not have an adjudication |
| HO100326 | Inconsistent result: Sentence but PNC does not have an adjudication |
| HO100328 | Unable to determine whether fixed penalty or court case should be resulted |
| HO100329 | Unable to identify correct fixed penalty |
| HO100331 | Case has 100+ offences - refer to court register |
| HO100332 | Offences match more than one CCR |
| HO100333 | Manual match detected but no case matches upon resubmission, suggesting ASN updated or PNC data updated manually before resubmission |
| HO100401 | PNC Update returned a business error |
| HO100402 | PNC Update returned a system fault (e.g. returned an unexpected error code) |
| HO100403 | PNC Update returned a warning |
| HO100404 | PNC Update failed (e.g. communication failure, timeout) |
| HO100507 | Offences added by court at Penalty Hearing |

Post Hearing Outcome Publication ('update' errors):

| Error ID | Message |
|----------|---------|
| HO100201 | Bad PTI-URN format |
| HO200100 | Inconsistent result: Adjournment pre Judgement but PNC has an adjudication |
| HO200101 | Inconsistent result: Adjournment with Judgement but PNC has an adjudication |
| HO200103 | Inconsistent result: Adjournment post Judgement but PNC does not have an adjudication |
| HO200104 | Inconsistent result: Judgement with final result but PNC has an adjudication |
| HO200106 | Inconsistent result: Sentence but PNC does not have an adjudication |
| HO200108 | Insufficient information to create reference for 'Refer to Court Case'. |
| HO200109 | Invalid operation sequence: Results in the Hearing Outcome are not consistent |
| HO200110 | Non-police / Dummy ASN encountered |
| HO200111 | Unknown order varied/revoked result code |
| HO200113 | The PNC cannot be updated automatically because there are new remands together with sentencing. It will have to be done manually. |
| HO200114 | The PNC cannot be updated automatically because there are changes to existing disposals together with sentencing. It will have to be done manually. |
| HO200115 | The PNC cannot be updated automatically because there are changes to existing disposals together with new disposals. It will have to be done manually. |
| HO200117 | Too many results present - review on PNC |
| HO200118 | Cannot generate PNC updates because the relevant results are in the result stop list. |
| HO200121 | Business Error: Cannot generate PNC updates because there are no offences that can be sent to the PNC. |
| HO200124 | The PNC cannot be updated automatically because there are adjudications together with existing final results. It will have to be done manually. |
| HO200200 | PNC disposal Text exceeds 64 Characters |
| HO200201 | Result Qualifier Duration is present |
| HO200202 | Too many Result Qualifiers present |
| HO200203 | Too many Bail Conditions present |
| HO200204 | Bail Condition Text too long |
| HO200205 | Amount Specified In Result too large |
| HO200212 | Offence has no valid PNC results |