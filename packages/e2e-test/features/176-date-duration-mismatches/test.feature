Feature: {176} BR7 R5.3-RCD497 - Partial Match - Date Duration

			"""
			{176} BR7 R5.3-RCD497 - Partial Match - Date Duration
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Code Transformation and Identical Offence Matching where the only difference in the Results received is the "Duration" enforced by the Court.
			Specifically:
			- Offences 1, 2 and 3 are identical but the Results received from Court are not (the Duration values imposed as part of Sentencing are different)
			The solution cannot automatically update the PNC since there is no way to uniquely determine which Result belongs to which Offence on the PNC and therefore an Exception is generated.
			PNC Exception Update is generated for the Court Hearing Results with portal-added values (Offence Sequence Numbers).
			CJS Result Code “1507” is transformed to a “1002” PNC Disposal in order for PNC to accept the update from Magistrates Court and the results are successfully added onto the PNC.
			Pre Update Triggers are created on the Portal.

			MadeTech Definition:
			Manually resolving exceptions for date duration mismatches
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: Manually resolving exceptions for date duration mismatches
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "PR06 - Imprisoned" in the exception list table
		When I open the record for "Dibbley Marcus"
			And I click the "Offences" tab
			And I view offence "1"
			And I correct "Sequence Number" to "1"
			And I click the "Offences" tab
			And I view offence "2"
			And I correct "Sequence Number" to "2"
			And I click the "Offences" tab
			And I view offence "3"
			And I correct "Sequence Number" to "3"
			And I click the "Offences" tab
			And I submit the record
		Then the PNC updates the record
