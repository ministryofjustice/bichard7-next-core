---
layout: default
title: Useful tips
---

This section includes the most frequent queries to date and should be checked before calling the MoJ DTSD with any new queries.

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

## Added offences

When new offences are added in the magistrates' court, these will be added to PNC by Bichard 7 only when a verdict is received or if it is 'Committed for Sentence' to the Crown court. New offences are not added for adjournment results or for remands to the Crown Court, though offences replacing other offences will be processed as long as the court has used the 'withdrawn in favour of another offence' result. Triggers TRPS0010 (Offence added to the PNC) and TRPS0011 (Offence added at court – add to PNC) are provided to assist forces in managing these cases.

## New OU codes

When any new Organisation Unit code is created, it is the responsibility of the PNC Bureau to report them to the MoJ DTSD so that they can be added to Bichard 7. These can be identified by the error codes:

- HO100200 (Invalid Organisation Unit Code),
- HO100300 (Organisation not recognised: OU Code)

Forces can create new station codes and use them in the ASN/URN however they must be notified to the MoJ DTSD.
 
If a new OU code needs to be created or amended for courts, the Libra Standing Data Team will set this up.

## ASN format

One of the most common errors is caused by incorrect ASNs entered onto Libra manually by court staff. Please note that ASNs must be 20 characters long. PNC provides ASNs in a short format and this must be converted into the CJS Data Standard format before it can be entered into Libra. Please note where the extra zeros have been inserted and that there are no slashes.
 
Example of an ASN in PNC: 09/88AA/01/123456/X
 
The same ASN with the extra zeros, and no slashes in the agreed format is: 0988AA0100000123456X
 
Leading zeros should always be inserted before the actual case number, rather than after the year. For example, 10/0000/00/12345/Q - the additional zeros should be inserted before the "123…" as in 1000000000000012345Q. If the zeros are inserted in any other place within the ASN, then this impacts the actual number and causes a Dummy ASN to be created.

## Missing triggers

To receive a trigger the user must be configured to receive it and the force must be configured to have the trigger generated. If the configuration is incorrect then the trigger will not be received.
 
The decision on whether to generate the trigger is based on the configuration of the force handling the exception. In out-of-area cases (and those brought by non- geographic forces) where Bichard 7 cannot identify the prosecuting force from the Force Owner, ASN and/or PTI-URN, and allocates the case to the force local to the court; then this may not be the same set of triggers as the prosecuting force.

## Non-recordable offences in the portal

Non-recordable offences can appear in the portal due to the following reasons:
- The offence is attached to a case which contains recordable offences.
- The case has an ASN which is on PNC.
- The case contains an error and has failed validation.
 
## Result codes

The result codes used by the courts are very different from those used on PNC. The Libra result code is translated into a CJS result code by Libra as part of the process of sending the data to Bichard 7, therefore when discussing results with court staff it may be necessary to use the result text rather than the codes.
 
## Qualifiers

Court staff can not see result qualifiers. Qualifiers are automatically added by Libra and are not added in court. A court resulter therefore cannot enter any qualifiers. If the qualifier can and should be entered onto PNC then the PNC Bureau should contact the Helpdesk as the Bichard 7 solution will need updating. If the error appears to be due to an incorrect result code being selected, then inform the specific court of the case details so that it can be investigated.
 
# Breaches & community orders

A community order has an end date and not a duration. It is mandatory for courts to enter an end date in Libra.

## Split adjournments

Split Adjournments occur when there is more than one offence under an ASN and the offences get split to different court dates or to different courts. PNC does not give Bichard 7 the ability to split the cases to different hearings therefore it has to be done manually. These cases will always exception to the Bichard 7 portal.
 
## Reduced driving disqualification sentences

When Bichard 7 results a driving disqualification sentence with a result code of 3050, it means that a reduction has been OFFERED to the defendant on completion of the appropriate course. The wording on Libra has caused confusion as this is an offer of a course rather than indicating that the course has been completed.
 
Note that the qualifier OA should be added to the result code 3070 AFTER notification to police that the course has been completed.
