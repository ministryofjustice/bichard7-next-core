Feature: {162} BR7 R5.3-RCD505 - Ignored offence - Result Class

			"""
			{162} BR7 R5.3-RCD505 - Ignored offence - Result Class
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Ignored Offences handling where the Offences are present on the PNC.
			Specifically:
			- Message 1: All Ignored Offences Adjourned With Judgement (NEWREM & DISARR)
			PNC Updates are generated and the Court Hearing Results are successfully added automatically onto the PNC.
			- Message 2: All Ignored Offences Sentenced (SENDEF)
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Triggers are also successfully created on the Portal.

			MadeTech Definition:
			Ignored Offences handling where the Offences are present on the PNC
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	Scenario: Ignored Offences handling where the Offences are present on the PNC
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then there are no exceptions raised for "Result Franklin"
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And the PNC updates the record
