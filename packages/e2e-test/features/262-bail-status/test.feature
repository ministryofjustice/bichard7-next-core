Feature: {262} BR7 R5.7-RCD602-No NEWREM Bail Conditions for Defendant on Pre Release Conditions

			"""
			{262} BR7 R5.7-RCD602-No NEWREM Bail Conditions for Defendant on Pre Release Conditions
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Remand in Custody with Pre-Release conditions handling:
			Court Hearing Results (Custody with Pre Release Conditions) are sent through the CJSE and onto Bichard7.
			The solution recognises that the Bail Status is considered to be a Custodial Remand and as a result the Court Result does not appear on the Bail Conditions Report.
			A Pre Update Trigger is created (not TRPR0010) to indicate the Defendant's Remand Status (Custody with Bail Direction).
			The PNC is successfully updated.
			No Bail Conditions are added onto the PNC.

			MadeTech Definition:
			No NEWREM Bail Conditions for Defendant on Pre Release Conditions
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: No NEWREM Bail Conditions for Defendant on Pre Release Conditions
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR19 - Bail direction" in the exception list table
			And there are no exceptions raised for "PRERELEASECONDITIONS DefendantOn"
			And the PNC updates the record
		When I navigate to the list of reports
			And I access the "Bail Conditions" report
			And I generate today's report
		Then I do not see "01ZD0300108" in the report
