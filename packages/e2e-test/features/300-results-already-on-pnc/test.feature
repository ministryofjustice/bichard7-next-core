Feature: {300} BR7-R5.9-RCD401-501-Subsequent Remand-Different Dates

			"""
			{300} BR7-R5.9-RCD401-501-Subsequent Remand-Different Dates
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying 'Results already on PNC' processing where Remand Results (Adjournment Pre Judgement) are received from Magistrates Court.
			Offences with Remand results are already present on the PNC.
			The Remand results from Court match identically to those already on the PNC EXCEPT for the date.
			No General Event Log entry of 'Results already on PNC' is generated.
			The Results from Court are successfully added to the PNC.

			MadeTech Definition:
			Verifying 'Results already on PNC' processing
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@ExcludeOnPreProd
	Scenario: Verifying 'Results already on PNC' processing
		Given I am logged in as "supervisor"
			And "input-message-1" is received
			And I wait "3" seconds
			And "input-message-2" is received
		When I view the list of exceptions
		Then there are no exceptions or triggers
			And the PNC updates the record
			And "Results already on PNC" is not in the audit log
