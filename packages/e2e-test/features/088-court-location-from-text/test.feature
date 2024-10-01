Feature: {088} R4.1.1_BR7_Court Location from Text

			"""
			{088} R4.1.1_BR7_Court Location from Text
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the extraction of Next Hearing information from Result Text and Results (Adjournment Pre Judgement) automation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The solution recognises that no structured Next Hearing information is provided and successfully extracts the Next Hearing details from the Result Text in the Court Hearing Results.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.

			MadeTech Definition:
			PNC is updated with next hearing location from court results
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: PNC is updated with next hearing location from court results
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
