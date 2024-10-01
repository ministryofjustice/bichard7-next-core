Feature: {323} BR7 R5.11-RCD687 - Existing Offence Result 2060 with Offence added in court Result 1000 and Recordable Result_PNC Updated

			"""
			{323} BR7 R5.11-RCD687 - Existing Offence Result 2060 with Offence added in court Result 1000 and Recordable Result_PNC Updated
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the existing offence with 2060 result and a offence added in court with no verdict a 1000 result and another recordable result.
			No HO200108 produced.
			TRPS0010 Triggers Raised.
			Offence added in court applied to PNC.
			2060  replaced with 2063 result on PNC update

			MadeTech Definition:
			Existing offence with 2060 result and 1000 result added in court
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Existing offence with 2060 result and 1000 result added in court
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And there are no exceptions
