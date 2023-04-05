# Hypotheses

- Nothing matches
- Offence code matches, but dates don't
- Extra (unresulted?) offence on the PNC

- If any offences in a PNC court case are matched, then all must be matched
- At least one PNC court case has to be matched

# Observations

- If court offence has an end date but PNC doesn't, raise 304

# Not matching all PNC offences

 - s3://bichard-7-production-processing-validation/2023/03/27/12/50/ProcessingValidation-c2df5c36-d26c-4b19-8293-9521f40b3de2.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/36/ProcessingValidation-63d7c1eb-aebb-45d3-9c0b-035221352cb6.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/34/ProcessingValidation-567076b2-7987-4875-a116-f2ffc46733f2.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/11/ProcessingValidation-575ef425-1bf1-47da-a900-0a81e65abb10.json
 - s3://bichard-7-production-processing-validation/2023/03/27/12/10/ProcessingValidation-6c6e1f6a-8d50-4795-abf3-191edcade200.json

# Perfect match, but Bichard raises a HO100310 because there are identical offences

- s3://bichard-7-production-processing-validation/2023/03/27/12/41/ProcessingValidation-8825a10b-fc9e-496e-b0e6-193b8852a39d.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/33/ProcessingValidation-5c32698e-c558-43d5-a010-201ae6bbc56f.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/33/ProcessingValidation-57da09c5-4315-4fa2-b80c-7b0198c2ea23.json

# Matching with identical HO offences - we preserve sequence number, Bichard preserves order

- s3://bichard-7-production-processing-validation/2023/03/27/12/33/ProcessingValidation-128f18a8-9a90-455c-bb97-9785ff789f88.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/30/ProcessingValidation-4f6ec1b3-81d8-4212-802a-dc2e6b63de21.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/37/ProcessingValidation-3df40c3f-13ee-44e1-82f4-1a47eed9c56a.json
- s3://bichard-7-production-processing-validation/2023/03/27/12/01/ProcessingValidation-e6a64b3b-1a4a-4bbd-ba9f-ba063144547b.json

# We trust the sequence number, Bichard doesn't

- s3://bichard-7-production-processing-validation/2023/03/27/12/29/ProcessingValidation-822ee4e9-901e-4618-bdf9-a33aff5bbfad.json

# Need to fix:

- s3://bichard-7-production-processing-validation/2023/03/27/12/23/ProcessingValidation-d42aa4c0-75fe-4c17-a710-38ea9fc3ca06.json

# To investigate:

PNC response seems invalid:
- s3://bichard-7-production-processing-validation/2023/03/27/12/21/ProcessingValidation-b3e76516-38c9-4cb5-bd55-82efb2ef8baa.json

# Bichard was wrong

Says offence was added by the court, we raise a HO100304
- s3://bichard-7-production-processing-validation/2023/03/27/12/20/ProcessingValidation-4497586d-320f-4049-bea5-56bd0fb82a00.json
