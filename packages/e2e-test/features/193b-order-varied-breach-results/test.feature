Feature: {193b} BR7 R5.3.2-RCD422-Standalone Breach-Order to Continue-Order Varied

			"""
			{193} BR7 R5.3.2-RCD422-Standalone Breach-Order to Continue-Order Varied
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Class calculation and Breach scenario processing.
			Specifically:
			Court Hearing Results are received for a Standalone Breach Offence resulting the Breach with an "Order Varied".
			The Result Class for the Offence/Result is set to "Judgement With Final Result".
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Triggers are also created on the Portal.

			MadeTech Definition:
			Order Varied breach results
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	@NextUI
	Scenario: Order Varied breach results
		Given "input-message" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And I see trigger "PR20 - Breach" in the exception list table
			And there are no exceptions
