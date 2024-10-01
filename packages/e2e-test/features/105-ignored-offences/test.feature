Feature: {105} BR7 R5.0-RCD334-4583-Some Offences Ignored

			"""
			{105} BR7 R5.0-RCD334-4583-Some Offences Ignored
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Ignored Results (Offences) Results automation (Judgement with Final Result) and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The solution recognises that an additional Offence (which is not on the PNC) has been resulted in error (i.e.
			using Result Code 4583) and this Offence and its associated results are stripped from the update that will be sent to the PNC.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre and Post Update Triggers are also generated.

			MadeTech Definition:
			Ensuring that ignored offences are not displayed
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Ensuring that ignored offences are not displayed
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PS02 - Check address" in the exception list table
		When I open the record for "SOMEOFFENCES IGNORE"
			And I click the "Offences" tab
		Then I see "TH68010" for offence "1"
			And I see "TH68012" for offence "2"
			And there should only be "2" offences
