Feature: {174} BR7 R5.3-RCD497 - Partial Match - Stop List

			"""
			{174} BR7 R5.3-RCD497 - Partial Match - Stop List
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Identical Offence Matching where Results received are identical except for a Stop List Result for one Offence.
			Specifically:
			- Offences 1 and 2 are identical and the Results received from Court are also identical with the only difference that 1 Offence has also been resulted with a Result which is in the Result Codes Stop List
			The Stop List Result is stripped out by the solution and since the Offences and their associated results are then seen as identical an update to the PNC is successfully generated.
			Pre Update Triggers are created on the Portal.

			MadeTech Definition:
			Ensure offences are correctly matched when there is a partial match in the stop list
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Ensure offences are correctly matched when there is a partial match in the stop list
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions
			And the PNC updates the record
