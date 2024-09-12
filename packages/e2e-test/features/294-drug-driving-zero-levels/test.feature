Feature: {294} BR7-R5.9-RCD605-Drug Driving-Minimum AlcoholLevelAmount

			"""
			{294} BR7-R5.9-RCD605-Drug Driving-Minimum AlcoholLevelAmount
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies those changes brought about as part of RCD entry #605, specifically those changes to enable the handling of Drug-Driving Offences.
			Court Hearing Results (Adjournment With Judgement) are sent through the CJSE and onto Bichard7 containing results for a Drug Driving Offence associated with a 'zero (0)' AlcoholLevelAmount and AlcoholLevelMethod value 'N' (Methamphetamine).
			A Pre Update Trigger is created.
			The PNC is successfully updated with the results from Court.

			MadeTech Definition:
			Handling results with drug driving zero levels
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Handling results with drug driving zero levels
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR01 - Disqualified driver" in the exception list table
			And there are no exceptions raised for "DRUGDRIVING MINVALUE"
			And the PNC updates the record
