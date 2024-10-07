Feature: {197} BR7-R5.3.2-RCD556-Offence Withdrawn

			"""
			{197} BR7-R5.3.2-RCD556-Offence Withdrawn
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Class calculation and Withdrawn Offences processing.
			Specifically:
			Court Hearing Results are received for which all Offences are resulted as "Withdrawn".
			The Result Class for the Offence/Result is set to "Judgement With Final Result".
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.

			MadeTech Definition:
			Verify Result Class calculation and Withdrawn Offences processing
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Verify Result Class calculation and Withdrawn Offences processing
		Given I am logged in as "supervisor"
		Then the PNC updates the record
			And the record for "PUFIVE UPDATE" does not exist
