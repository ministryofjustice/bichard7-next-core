Feature: {036} 3.3_BR7_Penalty Points for Result Code 3008

			"""
			{036} 3.3_BR7_Penalty Points for Result Code 3008
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Penalty Points handling and Court Results automation.
			Court Hearing results including Penalty Points are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.

			MadeTech Definition:
			Hearing results with penalty points are sent to the PNC
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Hearing results with penalty points are sent to the PNC
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
