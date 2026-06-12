Feature: {209} BR7-R5.4-RCD548-Offence Added In Court, Adj Pre Judg, PNC Adj exists

			"""
			{209} BR7-R5.4-RCD548-Offence Added In Court, Adj Pre Judg, PNC Adj exists
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation where an Offence is Added In Court which cannot be added to the PNC.
			- Message 1: All Offences Adjourned with Judgement (NEWREM & DISARR).
			- Message 2: Results received from Court including an Offence Added In Court (CJ03522).
			'CJ03522' is an Offence that is not accepted by the PNC and is therefore stripped off the PNC Update by the solution.
			The PNC Update is generated and successfully sent onto the PNC.

			MadeTech Definition:
			Offence added in court which cannot be added to the PNC
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	@NextUI
	Scenario: Offence added in court which cannot be added to the PNC
		Given I am logged in as "supervisor"
			And "input-message-1" is received
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then the PNC updates the record
			And there are no exceptions or triggers
