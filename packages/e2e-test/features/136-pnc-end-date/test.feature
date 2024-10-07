Feature: {136} BR7 R5.1.3-RCD462 - No PNC-End-Date All Offences Dates the same

			"""
			{136} BR7 R5.1.3-RCD462 - No PNC-End-Date All Offences Dates the same
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Code Matching where PNC or Court Start Date and End Dates are equal where only the Court specifies an Offence End Date, it is the same as the Court Offence Start Date and both the Court and PNC Offence Start Dates are the same.
			Specifically:
			- Offence 1 is associated to an OffenceDateCode value of '1' and has both Court Offence Start and End Dates.
			The corresponding PNC Offence has an Offence Start Date only and all 3 x Dates (Court Start, Court End, PNC Start) are identical
			- Offence 2 is associated to an OffenceDateCode value of '1' and has both Court Offence Start and End Dates.
			The corresponding PNC Offence has an Offence Start Date only and all 3 x Dates (Court Start, Court End, PNC Start) are identical
			- Offence 3 is associated to an OffenceDateCode value of '1' and has both Court Offence Start and End Dates.
			The corresponding PNC Offence has an Offence Start Date only and all 3 x Dates (Court Start, Court End, PNC Start) are identical
			Since all Offences are considered a match and no manual update is required on the PNC no Pre Update Triggers (TRPR0018) are generated.
			An Offence is also Added In Court and included in the update to the PNC
			Post Update Triggers are also created.

			MadeTech Definition:
			Testing start and end date matching for offence codes
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: testing start and end date matching for offence codes
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
			And I wait for "IDENTICALDATES NOPNCENDDATE" in the list of records
		Then there are no exceptions raised for "IDENTICALDATES NOPNCENDDATE"
			And I see trigger "PS10 - Offence added to PNC" in the exception list table
			And I cannot see trigger "PR18" in the exception list table
