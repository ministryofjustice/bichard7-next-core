Feature: 602 - ASN Update / Correction in the Old Bichard7 UI

			"""
			There is an exception on the incoming message which, when fixed, shows the ASN Correction
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	Scenario: Updates the ASN in Bichard
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
		When I open the record for "SEXOFFENCE TRPRFOUR"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000448754K"
		When I return to the list
			And I save a record
			And I open the record for "SEXOFFENCE TRPRFOUR"
			And I click the "Defendant" tab
			And I see the correction for "ASN" to "11/01ZD/01/448754K"
