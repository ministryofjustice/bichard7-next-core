Feature: {327} BR7 R5.11-RCD688 - Existing Offence Result_2060 and 2050 with Offence added in court Result_2059_Replace 2060 with 2063 and remove 2050 on PNC Update

			"""
			{327} BR7 R5.11-RCD688 - Existing Offence Result_2060 and 2050 with Offence added in court Result_2059_Replace 2060 with 2063 and remove 2050 on PNC Update
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the existing offence with 2060 and 2050 result.
			An offence is added in court with a 2059 result.
			Replace 2060 with 2063 result and remove 2050 from the update to PNC.
			TRPRS0010 Produced

			MadeTech Definition:
			Existing offence with 2060 and 2050 result and 2059 result added in court
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextU
	Scenario: Existing offence with 2060 and 2050 result and 2059 result added in court
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And there are no exceptions
