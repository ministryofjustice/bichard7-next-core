Feature: {161} BR7 R5.3-RCD505 - Ignored offence - Judge Final Result x2

			"""
			{161} BR7 R5.3-RCD505 - Ignored offence - Judge Final Result x2
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Ignored Offences handling where the Offences are present on the PNC.
			Specifically:
			- Message 1: Ignored Offence 1 = Judgement with Final Result (DISARR)
			PNC Updates are generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Triggers are also created and resolved via the Portal.
			- Message 2: Ignored Offence 1 (same Offence as Message 1 but different final results) = Judgement with Final Result
			An Exception is created since there are incompatibilities between the results on the PNC and those received from Court, i.e.
			existing Final Results on the PNC and an Adjudication received from Court.

			MadeTech Definition:
			Handling ignored offences
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	Scenario: Handling ignored offences
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions raised for "Judge Franklin"
			And I see trigger "PR06 - Imprisoned" in the exception list table
		When I open the record for "Judge Franklin"
			And I click the "Triggers" tab
			And I resolve all of the triggers
		Then the "record" for "Judge Franklin" is "resolved"
		Then the "record" for "Judge Franklin" is not "unresolved"
		When "input-message-2" is received
		Then there are no triggers raised for "Judge Franklin"
			And I see exception "HO200104" in the exception list table
			And the PNC updates the record
