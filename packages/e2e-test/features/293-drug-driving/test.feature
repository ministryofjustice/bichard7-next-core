Feature: {293} BR7-R5.9-RCD605-Drug Driving Offences

			"""
			{293} BR7-R5.9-RCD605-Drug Driving Offences
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies those changes brought about as part of RCD entry #605, specifically those changes to enable the handling of Drug-Driving Offences.
			Court Hearing Results (Adjournment With Judgement) are sent through the CJSE and onto Bichard7 containing results for a Drug Driving Offence associated with an AlcoholLevelMethod value 'V' (Delta - 9 - Tetrahydrocannabinol).
			A Pre Update Trigger is created.
			The PNC is successfully updated with the results from Court.

			MadeTech Definition:
			Drug driving trigger is created
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Test that a drug driving trigger is created
		Given I am logged in as "supervisor"
		Then I see trigger "PR01 - Disqualified driver" in the exception list table
			And there are no exceptions
			And the PNC updates the record
