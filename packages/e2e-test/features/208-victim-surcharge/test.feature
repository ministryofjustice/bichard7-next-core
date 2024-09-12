Feature: {208} 3.2 UAT - Victim Surcharge

			"""
			{208} 3.2 UAT - Victim Surcharge
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation for Victim Surcharge - SPI ResultedCaseMessage sent through the CJSE and onto Bichard 7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.

			MadeTech Definition:
			Testing automation for victim surcharge
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Testing automation for victim surcharge
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
