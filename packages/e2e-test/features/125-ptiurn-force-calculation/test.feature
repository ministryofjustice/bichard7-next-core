Feature: {125} BR7 R5.1-RCD399-Force calculation-FFSS in PTIURN

			"""
			{125} BR7 R5.1-RCD399-Force calculation-FFSS in PTIURN
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Force Owner calculation is ultimately derived from the PTIURN value (the 'FFSS' element of the PTIURN).
			The Court Hearing Results received contain both valid PTIURN and valid ASN values so the Bichard7 solution uses the 'FFSS' element of the PTIURN value held on PNC to determine the Force (i.e.
			those users) that is able to view the Trigger Records that are created.
			This is then verified by logging in as Users belonging to Forces that SHOULD NOT and SHOULD be able to view the Trigger Records.

			MadeTech Definition:
			Force calculation from PTIURN
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Force calculation from PTIURN
		When I am logged in as "met.police"
			And I view the list of exceptions
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
		When I am logged in as "west.yorkshire"
			And I view the list of exceptions
		Then there are no exceptions or triggers
			And the PNC updates the record
