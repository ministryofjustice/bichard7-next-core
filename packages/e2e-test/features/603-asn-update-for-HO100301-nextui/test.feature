Feature: 605 - ASN Update / Correction in the Next UI when HO100301 raised

			"""
			There is an exception (HO100301 - ASN not found on PNC) on the incoming message, which enables user to edit ASN. When fixed, shows the ASN correction.
			"""

	Background:
		Given the data for this test is not in the PNC
			And "input-message" is received

	@NextUI
	@ExcludeOnLegacyUI
	Scenario: Updates the ASN in Bichard when HO100301 is raised
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100301" in the exception list table
		When I open the record for "ASNFF FORCECALC"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000448754K"
			And I see the correction for "ASN" to "11/01ZD/01/00000448754K"
		Then I submit the record
			And I reload until I don't see "(Submitted)"
