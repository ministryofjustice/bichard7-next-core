Feature: {194} BR7-R5.4-RCD548-R5.3.2-RCD556-Breach Offence with Re-sentence for original offence

			"""
			{194} BR7-R5.4-RCD548-R5.3.2-RCD556-Breach Offence with Re-sentence for original offence
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Class calculation and Breach scenario processing.
			Specifically:
			Court Hearing Results are received for a Breach Offence for which a Re-Sentencing of the original Offence is imposed.
			The Defendant Admits the Breach Offence.
			The Result Class for the New Breach Offence/Result is set to "Judgement With Final Result".
			The Result Class for the Offence providing details of the Re-Sentencing is set to "Sentence".
			The New Breach Offence is Resulted as "Dealt with for Original Offence" and the solution recognises this as a Result that cannot be added to the PNC (i.e.
			it is a Stop Listed Result); the Offence therefore has no Results and an Exception is created for manual resolution on the Portal.
			Pre Update Triggers are also created on the Portal.

			MadeTech Definition:
			Verifying that new Breach Offence creates Exception and Trigger
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Verifying that new Breach Offence creates Exception and Trigger
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO200212" in the exception list table
		When I open the record for "JUBES THETUBE"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "3501" in the "CJS Code" row of the results table
		When I return to the list
			And I view the list of exceptions
			And I open the record for "JUBES THETUBE"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0006"
			And I see trigger "TRPR0020" for offence "1"
			And I see trigger "TRPR0020" for offence "2"
			And the PNC record has not been updated
