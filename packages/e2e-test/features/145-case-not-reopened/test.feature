Feature: {145} BR7 R5.2-RCD490-TRPR0025 case not reopened

			"""
			{145} BR7 R5.2-RCD490-TRPR0025 case not reopened
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Case Re-Open Application handling where the Application is refused.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing only Offence "MC80524" (Application to reopen case), making the Case Non-Recordable.
			The Application is refused.
			The solution recognises the Application refusal and no Pre Update Trigger (TRPR0025) is created.
			In addition the Case itself is ignored since it contains no Recordable Offences or Results.
			Note also that this Test provides coverage of the revised "Section 142" business process).

			MadeTech Definition:
			Not creating case reopened trigger if offence is not recordable
			"""

	Background:
		Given the data for this test is not in the PNC
			And "input-message" is received

	@Could
	@PreProdTest
	Scenario: Not creating case reopened trigger if offence is not recordable
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the audit log contains "Re-opened / Statutory Declaration case ignored"
			And there are no exceptions or triggers
			And no PNC updates have been made
