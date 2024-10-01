Feature: {058} R3.1_BR7_NH_001_Next Hearing Court

			"""
			{058} R3.1_BR7_NH_001_Next Hearing Court
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Adjournment with Judgement), Youth and Adult Magistrates Court handling (if the Hearing.CourtHouseCode for the original hearing court is > 4000 and the legacy code we have looked up for the next court is < 4000 we should add 4000 to the next court legacy code) and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Triggers are also successfully created on the Portal.

			MadeTech Definition:
			Test next hearing location is calculated and updated correctly.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Test next hearing location is calculated and updated correctly
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
