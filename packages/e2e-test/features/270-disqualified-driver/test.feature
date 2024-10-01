Feature: {270} BR7 R5.7-RCD464-TRPR0026 Driving Disqualification Suspended

			"""
			{270} BR7 R5.7-RCD464-TRPR0026 Driving Disqualification Suspended
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the Driving Disqualification Suspended business process.
			Court Hearing Results are received detailing Driving Penalty Points and Driving Disqualification Suspension.
			The Offence is considered Non-Recordable but since it is already on the PNC the PNC is successfully updated with these Results.
			Pre Update Triggers are created to indicate the Results from Court.
			The Trigger is Marked as Complete once this has been completed.

			MadeTech Definition:
			Correctly handle disqualified driver triggers
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Correctly handle disqualified driver triggers
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR01 - Disqualified driver" in the exception list table
			And I see trigger "PR26 - Disq. Suspended" in the exception list table
			And there are no exceptions raised for "SUSPENDED DRIVERDISQ"
			And the PNC updates the record
