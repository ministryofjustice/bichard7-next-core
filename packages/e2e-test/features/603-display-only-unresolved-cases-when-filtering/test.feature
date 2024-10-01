Feature: 603 - Display correct cases when filtered with reason codes in the Next UI

			"""
			When Reased-codes filter is applied then show only the unresolved cases with that reason code
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@NextUI
	@ExcludeOnLegacyUI
	Scenario: Displays only unresolved cases when filtered with reason-codes
		Given I am logged in as "supervisor"
			And I apply filter "reasonCodes" to be "HO100206"
			And I click the "Apply filters" button
		Then I see record for "Brown James"
		When I open the record for "Brown James"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000448754K"
			And I see the correction for "ASN" to "11/01ZD/01/00000448754K"
		Then I submit the record
			And I reset the filters
			And I do not see record for "Submitted"
			And I do not see record for "Resolved"
		Then I apply filter "reasonCodes" to be "HO100206"
			And I click the "Apply filters" button
		Then I do not see record for "Brown James"
