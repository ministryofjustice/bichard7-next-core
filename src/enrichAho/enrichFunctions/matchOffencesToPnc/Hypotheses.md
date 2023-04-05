# Hypotheses

- Nothing matches
- Offence code matches, but dates don't
- Extra (unresulted?) offence on the PNC

- If any offences in a PNC court case are matched, then all must be matched
- At least one PNC court case has to be matched

# Observations

- If court offence has an end date but PNC doesn't, raise 304

# Not matching all PNC offences

Bichard currently seems to raise a HO100304 exception if all of the offences on the PNC are not matched. We need to find out if this is correct or not because it seems that not all offences would always be tried in the same court case.

 - s3://bichard-7-production-processing-validation/2023/03/27/12/50/ProcessingValidation-c2df5c36-d26c-4b19-8293-9521f40b3de2.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/36/ProcessingValidation-63d7c1eb-aebb-45d3-9c0b-035221352cb6.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/34/ProcessingValidation-567076b2-7987-4875-a116-f2ffc46733f2.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/11/ProcessingValidation-575ef425-1bf1-47da-a900-0a81e65abb10.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/10/ProcessingValidation-6c6e1f6a-8d50-4795-abf3-191edcade200.json
 - s3://bichard-7-production-processing-validation/2023/03/27/13/17/ProcessingValidation-fc553361-2fa9-49e9-9922-60eb5d6669d4.json
 - s3://bichard-7-production-processing-validation/2023/03/27/13/30/ProcessingValidation-06b25d21-2643-4742-9081-cf692f03f2de.json
 - s3://bichard-7-production-processing-validation/2023/03/27/13/33/ProcessingValidation-d69225fa-4d9d-4482-877c-3391e89955ad.json
 - s3://bichard-7-production-processing-validation/2023/03/27/13/35/ProcessingValidation-dd9d89a6-222f-4e07-9f8d-657c00f5bbdb.json

In this case one of the PNC offences was not matched and there was an extra HO offence. Should we raise an exception?:

- s3://bichard-7-production-processing-validation/2023/03/27/13/26/ProcessingValidation-059f4bdb-5805-4ee3-bf4b-23744f3dbd4d.json

This case seems to be an exception to the rule:

- s3://bichard-7-production-processing-validation/2023/03/27/13/37/ProcessingValidation-9e228763-26f3-4f58-a8e7-0d5f5bafc0a4.json
# Perfect match, but Bichard raises a HO100310 because there are identical offences

If we use the sequence numbers to match offences then all offences match perfectly, however bichard seems to ignore the sequence numbers and then raise an exception because it can't tell which offence should match to which

- s3://bichard-7-production-processing-validation/2023/03/27/12/41/ProcessingValidation-8825a10b-fc9e-496e-b0e6-193b8852a39d.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/33/ProcessingValidation-5c32698e-c558-43d5-a010-201ae6bbc56f.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/33/ProcessingValidation-57da09c5-4315-4fa2-b80c-7b0198c2ea23.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/28/ProcessingValidation-d4af1c5a-9920-4828-a892-16f17d1c2799.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/35/ProcessingValidation-0e6170f3-dbb7-4862-bc68-1716a286687d.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/36/ProcessingValidation-36e17e3d-9b0d-46fc-a8a0-02e020f7edfb.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/40/ProcessingValidation-4e2ac8e5-8c9a-447e-91b9-ccfc403db038.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/52/ProcessingValidation-8d4f0dc8-7345-4fd4-8a40-0f0ac0213a68.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/56/ProcessingValidation-a16bb402-1b9f-4af1-8c80-022284705b76.json


# Offence code has changed

The RT88191 offence code for no insurance has changed to RA88001 - this is now in conflict with the PNC. Wonder if we should arise an exception when there is an extra HO offence compared to PNC?

- s3://bichard-7-production-processing-validation/2023/03/27/13/40/ProcessingValidation-778ffdac-b794-4da7-9825-07fa338bffda.json


# Matching with identical HO offences - we preserve sequence number, Bichard preserves order

In this case the outcome is the same, however we match using the sequence number first, whereas Bichard uses the order of the offences in the results

- s3://bichard-7-production-processing-validation/2023/03/27/12/33/ProcessingValidation-128f18a8-9a90-455c-bb97-9785ff789f88.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/30/ProcessingValidation-4f6ec1b3-81d8-4212-802a-dc2e6b63de21.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/37/ProcessingValidation-3df40c3f-13ee-44e1-82f4-1a47eed9c56a.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/01/ProcessingValidation-e6a64b3b-1a4a-4bbd-ba9f-ba063144547b.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/57/ProcessingValidation-a2cdd155-92df-4de8-8d8f-7d6ff948a60f.json

# We trust the sequence number, Bichard doesn't

There are multiple identical offences, not all of the sequence number match but if you trust them then there's a match. Bichard currently raises an exception

- s3://bichard-7-production-processing-validation/2023/03/27/12/29/ProcessingValidation-822ee4e9-901e-4618-bdf9-a33aff5bbfad.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/19/ProcessingValidation-d301901c-1265-44d2-91a4-6df310ffd4e5.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/59/ProcessingValidation-2d2c5211-aaf3-45f2-9a84-f760ef4bbdfd.json

This is an interesting example of a good match that Bichard raises an exception for
- s3://bichard-7-production-processing-validation/2023/03/27/13/34/ProcessingValidation-428f29c4-c6c5-4946-9c9e-43192c9696b8.json

# All offences match a single court case, but another court case adds doubt

All of the offences in the court case match one of the court cases in the PNC exactly, but a second court case in the PNC has a conflicting offence. Should we raise an exception?

- s3://bichard-7-production-processing-validation/2023/03/27/13/23/ProcessingValidation-5733a9ac-5e7e-43b7-8591-1eb117a5d764.json

# Need to fix:

- s3://bichard-7-production-processing-validation/2023/03/27/12/23/ProcessingValidation-d42aa4c0-75fe-4c17-a710-38ea9fc3ca06.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/01/ProcessingValidation-c91248b1-caf0-4be7-b3d3-4c930181f3a8.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/05/ProcessingValidation-f911a4a8-59f9-4cef-8945-4b25f6fff0ad.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/10/ProcessingValidation-8e7277ed-3572-4c5f-840d-75bd28072717.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/35/ProcessingValidation-f5029d15-4e9f-4907-8f5d-6aacd8dee3b1.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/35/ProcessingValidation-a3a76f3a-fbf8-4dad-86c1-029b3cf17d2a.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/35/ProcessingValidation-5355ad2d-a742-4519-bc6b-1a98b90f5cb1.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/43/ProcessingValidation-3fd04150-ca02-45b7-9b79-b99c7f5ad602.json
- s3://bichard-7-production-processing-validation/2023/03/27/13/54/ProcessingValidation-3746b9a6-b204-44cb-b1c3-d0be127bffb3.json

# Need to implement

- s3://bichard-7-production-processing-validation/2023/03/27/13/10/ProcessingValidation-e7bddc18-fe63-4783-be19-3c4c6e4c7b26.json HO100332
- s3://bichard-7-production-processing-validation/2023/03/27/13/20/ProcessingValidation-daa0cb05-fd7b-4bed-b0bd-7fc53ae0fb3a.json HO100312

# To investigate:

PNC response seems invalid:
- s3://bichard-7-production-processing-validation/2023/03/27/12/21/ProcessingValidation-b3e76516-38c9-4cb5-bd55-82efb2ef8baa.json

See https://eu-west-2.console.aws.amazon.com/dynamodbv2/home?region=eu-west-2#edit-item?table=bichard-7-production-audit-log-events&itemMode=2&pk=677457ef-ec28-4521-af11-e32743191869&sk&route=ROUTE_ITEM_EXPLORER

PNC Response did not include the offence code!

# Bichard was wrong

Says offence was added by the court, we raise a HO100304
- s3://bichard-7-production-processing-validation/2023/03/27/12/20/ProcessingValidation-4497586d-320f-4049-bea5-56bd0fb82a00.json
