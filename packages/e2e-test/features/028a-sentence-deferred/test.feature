Feature: {028a} Verifying police system is updated successfully for subsequent disposal result for sentence deferred

			"""
			{028} Driver Disqualification - Duration and Date values
			===============
			MadeTech Definition:
			Verification of Driver Disqualification handling where only a Duration is received from the Court.
			This test is similar to test 033, but it only verifies adding subsequent disposal results.
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI @LedsPreProdTest
	Scenario: Driver Disqualification handling when only a Duration is received
		Given I am logged in as "supervisor"
		When "input-message" is received
			And I view the list of exceptions
		Then I see trigger "PR01 - Disqualified driver" in the exception list table
			And there are no exceptions raised for "Jimbobjones Bobby"
			And the PNC updates the record
