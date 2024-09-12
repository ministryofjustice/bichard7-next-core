Feature: {196} BR7-R5.3.2-RCD556-Breach Offence with Re-sentence for original offence and adjourn

			"""
			{196} BR7-R5.3.2-RCD556-Breach Offence with Re-sentence for original offence and adjourn
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Class calculation and Breach scenario processing.
			Specifically:
			Court Hearing Results are received for a Breach Offence for which a Re-Sentencing of the original Offence is imposed and Sentencing is Adjourned to a Next Hearing.
			The Defendant Admits the Breach Offence.
			The Result Class for the New Breach Offence/Result is set to "Judgement With Final Result".
			The Result Class for the Offence providing details of the Next Hearing is set to "Adjournment Post Judgement".
			The New Breach Offence is Resulted as "Dealt with for Original Offence" and the solution recognises this as a Result that cannot be added to the PNC (i.e.
			it is a Stop Listed Result); the Offence therefore has no Results and an Exception is created for manual resolution on the Portal.
			Pre Update Triggers are also created on the Portal.

			MadeTech Definition:
			Re-sentencing of the original offence is adjourned to the next hearing, so an exception is returned
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: re-sentencing of offence is adjourned to a new hearing
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO200212" in the exception list table
			And I see trigger "PR20 - Breach" in the exception list table
			And the PNC record has not been updated
