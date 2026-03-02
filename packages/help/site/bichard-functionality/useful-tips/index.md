---
layout: default
title: Useful tips
---

This section includes the most frequent queries to date and should be checked before calling the MoJ DTSD with any new queries.

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
