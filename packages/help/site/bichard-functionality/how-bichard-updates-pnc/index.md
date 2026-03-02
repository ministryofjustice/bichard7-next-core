---
layout: default
title: Police National Computer (PNC)
---

## How Bichard updates the PNC

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

## Incomplete information on PNC

Misconceptions regarding the way Bichard 7 works may make users think that a case has either only partially updated PNC or completely failed to update PNC (and did not appear as an exception in the portal). If, after checking the points below, you think you have a problem with incomplete information, report it to the helpdesk as this would be a priority issue.

Cases can appear to be incomplete or missing for the following reasons:

- The court has used 'case complete' on Libra to send through an urgent case and has then made changes to the results prior to register validation and publication. This is the only known cause of the results in Bichard 7 being different from the results on the register. Each case hearing is only sent out once from Libra and courts should have a process in place to manually inform Police if they change the results after case completion
- Bichard 7 cannot populate the IP page for remands due to a limitation in the interface offered by PNC to Bichard 7. If a result is a remand then the IP page will not be populated by Bichard 7. Both Bichard 7 and NSPIS have logged an RFC with PNC to allow this. Users will find the remand result from Bichard 7 on the remand page.
- Magistrates' court users may be resulting community order requirements incorrectly using the 'Additional Requirements' field to enter the information instead of the 'Programme Requirement' field. It should be noted that it is illegal not to have a duration in days in a programme requirement. Locally the court will need to work with the Justices' Clerk and probation to ensure that they get the right information.
- Bichard 7 can only add an additional offence to PNC when it has a verdict. If an offence is added by the court and adjourned before a verdict is given, Bichard 7 will create the remand only. Forces can use TRPS0011 (Offence added at court - add to PNC) to detect this. Bichard 7 will add the additional offence when a verdict is received.
- A case is not in the portal as expected because it has already been handled by the user/another user. The portal interface does not take you back to where you were in the summary page when you return to it so users may forget they have handled the case already or another user might have handled the case in the interim.
- Some, but not all, of the cases from a court session have been received as the court has used 'case complete' on Libra to send through urgent cases. If there is a significant delay before the rest of the register is validated then this can give the impression that the remaining cases are 'missing'. Before reporting a batch of cases as 'missing' check that the full session has been validated on Libra.
- Other forces' cases heard at courts within your area will not be seen in your portal if the Force Owner, ASN and/or PTI-URN for the cases are correctly set up to identify the owning force. If a case belonging to another force appears in your portal it will be because Bichard 7 could not identify the force code from the PNC, ASN or PTI-URN. Similarly if one of your cases is heard out of area then it will only appear in your portal if Bichard 7 can associate it with your force from the Force Owner, ASN or PTI-URN.
- User filters not set up correctly. Where a user cannot see a case, check they are configured to see the cases from the force/court concerned.
- A case on Libra that consists only of non-recordable offences, non-custodial results and has no ASN will not update PNC. If a case appears to be missing, check that the offence is actually a recordable offence. Note,however, you can get triggers for non-recordable offences (e.g. driving with no insurance leading to a driver disqualification).
- Orphan offences - If a non-recordable offence was committed in association with a recordable offence the non-recordable offence is put on PNC along with the recordable offence. If the two offences are separated (e.g. if one offence is sentenced while the other goes to trial or one gets a non-court disposal whilst the other goes to court) the non-recordable offence is called an 'orphan'. If the orphan does not have an ASN then Bichard 7 will ignore the result thinking it does not require an update to PNC. This issue has been raised to ACPO for guidance. Note that generally the orphan will have an ASN which it shares with the recordable offence so this circumstance will only typically occur if the ASN has been manually entered in the incorrect format. If an offence has an ASN and the ASN exists on PNC then Bichard 7 will result the offence regardless of whether it is recordable or not. If a non- recordable offence has a dummy ASN but has a custodial result then this will become an exception in the portal.
- Portal user does not receive a trigger as they are not configured to see the trigger or the force is not configured to generate the trigger.