Feature: {506} BR7 R5.2-RCD490-TRPR0025 case reopened with original offences

			"""
			{506} BR7 R5.2-RCD490-TRPR0025 case reopened with original offences
			===============
			Q-Solution Definition:

			MadeTech Definition:
			Case reopened with original offences
			"""

	Background:
		Given "input-message" is received
			And the data for this test is in the PNC

	@Should
	@PreProdTest
	@OnlyRunsOnPNC
	Scenario: Case reopened with original offences
		Then the audit log contains "Re-opened / Statutory Declaration case ignored"
		When I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
			And no PNC updates have been made
