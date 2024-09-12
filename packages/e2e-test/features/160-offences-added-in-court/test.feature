Feature: {160} BR7 R5.3-RCD482 - Offence added in court - No HO200124

			"""
			{160} BR7 R5.3-RCD482 - Offence added in court - No HO200124
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Results automation,  Trigger generation and Offences Added In Court handling.
			Specifically:
			- Message 1: Offence 1 = Judgement With Final Result (DISARR), Offence 2 = Adjournment Pre Judgement (NEWREM)
			PNC Updates are generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Triggers are also created.
			- Message 2: Offence 2 = Adjournment Pre Judgement (NEWREM), Offence 3 (Added In Court) = Judgement With Final Result (DISARR)
			The solution recognises the extra Offence as Added In Court and since there are now 2 x CCR Groups for the Defendant on the PNC the new Offence can be added.
			The 2nd (existing) and 3rd (Added) Offences are successfully updated on the PNC and Pre and Post Update Triggers are also created.

			MadeTech Definition:
			Handling offences added in court
			"""

	Background:
		Given the data for this test is in the PNC

	@Could @NextUI
	Scenario: Handling offences added in court
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions raised for "Bueller Paul"
			And I see trigger "PR06 - Imprisoned" in the exception list table
		When "input-message-2" is received
		Then there are no exceptions raised for "Bueller Paul"
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PS10 - Offence added to PNC" in the exception list table
			And the PNC updates the record
