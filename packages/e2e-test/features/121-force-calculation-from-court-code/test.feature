Feature: {121} BR7 R5.1-RCD399-Force calculation-FF code in CourtHearingLocation

			"""
			{121} BR7 R5.1-RCD399-Force calculation-FF code in CourtHearingLocation
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Force Owner calculation is ultimately derived from the Court Hearing Location value (the 'FF' element of the Court code).
			The Court Hearing Results received contain both invalid ASN and invalid PTIURN values so the Bichard7 solution uses the Court Hearing Location value to determine the Force (i.e.
			those users) that is able to view the Exception Record that is created.
			This is then verified by logging in as Users belonging to Forces that SHOULD NOT and SHOULD be able to view the Exception Record.
			The invalid ASN value is corrected, the record resubmitted from the Portal and the remaining exception is now visable to the force as defined by the corrected ASN

			MadeTech Definition:
			Deriving the force owner from the court hearing location
			"""

	@Should
	@PreProdTest
	@NextUI
	Scenario: Deriving the force owner from the court hearing location
		When I am logged in as "met.police"
			And "input-message" is received
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When I am logged in as "west.yorkshire"
			And I view the list of exceptions
		Then I see exception "HO100201" in the exception list table
		When I open the record for "COURT FORCECALC"
			And I click the "Defendant" tab
		Then I see error "HO100206" in the "ASN" row of the results table
		When I correct "ASN" to "1101VK0100000376269X"
			And I submit the record
			And I reload until I don't see "(Submitted)"
		Then I cannot see exception "HO100201" in the exception list table
		When I am logged in as "met.police"
			And I view the list of exceptions
			And I see exception "HO100201" in the exception list table
