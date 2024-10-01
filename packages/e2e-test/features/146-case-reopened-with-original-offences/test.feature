Feature: {146} BR7 R5.2-RCD490-TRPR0025 case reopened with original offences

			"""
			{146} BR7 R5.2-RCD490-TRPR0025 case reopened with original offences
			===============
			Q-Solution Definition:

			MadeTech Definition:
			Case reopened with original offences
			"""

	Background:
		Given the data for this test is not in the PNC
			And "input-message" is received

	@Should
	@PreProdTest
	Scenario: Case reopened with original offences
		When I am logged in as "supervisor"
			And I view the list of exceptions
		Then the audit log contains "Re-opened / Statutory Declaration case ignored"
			And there are no exceptions or triggers
			And no PNC updates have been made
