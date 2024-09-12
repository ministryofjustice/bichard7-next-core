Feature: {201} BR7-R5.3.2-RCD556-Offence Non-Conviction

			"""
			{201} BR7-R5.3.2-RCD556-Offence Non-Conviction
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Class calculation and Non-Conviction processing.
			Specifically:
			Court Hearing Results are received for which the Defendant is considered "Unfit To Plead".
			All Offences are given Pleas of "Unfit To Plead" and a Verdict of "Unfit To Plea" is recorded.
			The Result Class for the Offence/Result is set to "Judgement With Final Result".
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			A Pre Update Trigger is also created on the Portal.

			MadeTech Definition:
			Verifying that trigger is generated and PNC is updated when Defendant is considered as "Unfit To Plead"
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Trigger is generated and PNC is updated when Defendant is considered as "Unfit To Plead"
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		Then there are no exceptions raised for "DEEELAR THETUBE"
		When I open the record for "DEEELAR THETUBE"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0006"
			And the PNC updates the record
