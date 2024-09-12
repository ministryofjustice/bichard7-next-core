Feature: {159} BR7 R5.3-RCD482 - Offence added in court - Adj Post Judgement

			"""
			{159} BR7 R5.3-RCD482 - Offence added in court - Adj Post Judgement
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Results automation and the correct PNC Message Type generation where Offences are Added In Court.
			Specifically:
			- Message 1: Offence 1 = Adjournment with Judgement (NEWREM & DISARR)
			PNC Updates are generated and the Court Hearing Results are successfully added automatically onto the PNC.
			- Message 2: Offence 1 = Adjournment Post Judgment (NEWREM ONLY), Offence 2 (Added In Court) = Adjournment With Judgement
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			A Post Update Trigger is also successfully created on the Portal for the Offence (that cannot be) Added In Court and is manually resolved.

			MadeTech Definition:
			Adding offences in court
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	Scenario: Adding offences in court
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then I see trigger "PS11 - Add offence to PNC" in the exception list table
		When I open the record for "Largeman Alan"
			And I click the "Triggers" tab
			And I resolve all of the triggers
		Then there are no exceptions or triggers
			And the PNC updates the record
