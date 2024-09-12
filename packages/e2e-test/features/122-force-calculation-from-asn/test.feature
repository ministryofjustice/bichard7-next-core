Feature: {122} BR7 R5.1-RCD399-Force calculation-FF in ASN

			"""
			{122} BR7 R5.1-RCD399-Force calculation-FF in ASN
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Force Owner calculation is ultimately derived from the Arrest Summons Number value (the 'FF' element of the ASN).
			The Court Hearing Results received contain both invalid PTIURN and invalid ASN (unknown 'SS' segment) values so the Bichard7 solution uses the 'FF' element of the ASN value to determine the Force (i.e.
			those users) that is able to view the Exception Record that is created.
			This is then verified by logging in as Users belonging to Forces that SHOULD NOT and SHOULD be able to view the Exception Record.

			MadeTech Definition:
			Deriving the force owner from the ASN
			"""

	Background:
		Given the data for this test is not in the PNC
			And "input-message" is received

	@Should
	@PreProdTest
	Scenario: Deriving the force owner from the ASN
		When I am logged in as "met.police"
			And I view the list of exceptions
		Then I see exception "HO100201 " in the exception list table
		When I open the record for "ASNFF FORCECALC"
			And I click the "Case" tab
		Then I see error "HO100201 - Bad PTIURN format" in the "PTIURN" row of the results table
		When I click the "Defendant" tab
		Then I see error "HO100301 - ASN not found on PNC" in the "ASN" row of the results table
		When I am logged in as "west.yorkshire"
			And I view the list of exceptions
		Then there are no exceptions or triggers
