Feature: {149} R5.1.3_BR7_CRQ453_Change of ReportOwner on PNC

			"""
			{149} R5.1.3_BR7_CRQ453_Change of ReportOwner on PNC
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Force Owner calculation is ultimately derived from details passed back by the PNC during a PNC query.
			The Court Hearing Results received contain both valid PTIURN and valid ASN values so the Bichard7 solution uses the FSC segment returned in the ASN Query Response from the PNC to determine the Force (i.e.
			those users) that is able to view the Trigger Records that are created.
			This is then verified by logging in as Users belonging to Forces that SHOULD NOT and SHOULD be able to view the Record.
			Note that this Test follows the standard MET Police practice as advised by Steve Green i.e.
			changing only the report Owner and not the Originator of the ASN.
			Post Update Triggers are also created.

			MadeTech Definition:
			Force owner is derived from the PNC response
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Force owner is derived from the PNC response
		Given I am logged in as "br7.btp"
			And I view the list of exceptions
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And the PNC updates the record
		When I am logged in as "met.police"
			And I view the list of exceptions
		Then there are no exceptions or triggers
