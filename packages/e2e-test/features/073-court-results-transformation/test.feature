Feature: {073} R4.0_BR7_Convert No Conviction for 2050-2051 to Not Guilty

			"""
			{073} R4.0_BR7_Convert No Conviction for 2050-2051 to Not Guilty
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result) and the conversion of 'Non Conviction' results from the Court to 'Not Guilty' results on the PNC for specific Result Codes.
			Court Hearing results are sent through the CJSE and onto Bichard7 where Offences have been Dismissed or Withdrawn (Result Codes 2050 & 2051).
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			The solution will convert the 'Non Conviction' values received from Court into 'Not Guilty' in order for the update to be considered acceptable to the PNC.

			MadeTech Definition:
			Run test if these flags are set then no exceptions are raised
			This is the live config
			asn.update.builder.verdict.guilty.disposals=
			asn.update.builder.verdict.notguilty.disposals=2006,2050,2051
			asn.update.builder.verdict.nonconviction.disposals=
			asn.update.builder.verdict.empty.disposals=2058,2059,2060

			If flags are set to the following an execption is raised, we need to test for both cases, but currently only the first
			This is flagged as a day2 scenario
			asn.update.builder.verdict.guilty.disposals=
			asn.update.builder.verdict.notguilty.disposals=

			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Add a case to the PNC, no exceptions are flagged if certain properties are set
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
