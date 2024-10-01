Feature: {109a} BR7 R5.0-RCD382-Order to Continue-HO-PNC Offence Dates different

			"""
			{109} BR7 R5.0-RCD382-Order to Continue-HO-PNC Offence Dates different
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach Offence handling where a mismatch of Offence Dates exists, Results automation (Judgement with Final Results) and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The Offence Start and End Dates for the single Breach Offence received from Court are ignored and not used to update the PNC (for Breach Offences there is no legal offence date and Libra sends the Court Date over the SPI interface).
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Triggers are also generated.

			MadeTech Definition:
			Ignoring breach offence dates
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Ignoring breach offence dates
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
			And the PNC updates the record
