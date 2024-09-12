Feature: {195} BR7-R5.3.2-RCD556-Breach Offence with Sentence

			"""
			{195} BR7-R5.3.2-RCD556-Breach Offence with Sentence
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Class calculation and Breach scenario processing.
			Specifically:
			Court Hearing Results are received for a Breach Offence resulting the Breach with a new Sentence.
			The Defendant Admits the Breach Offence and an Adjudication and Conviction Date are also sent from Court.
			The Result Class for the Breach Offence/Result is set to "Judgement With Final Result".
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Triggers are also created on the Portal.

			MadeTech Definition:
			PNC is updated for the provided Result Class in the Breach Offence/Result
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: PNC is updated for the provided Result Class in the Breach Offence/Result
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		Then there are no exceptions raised for "NORTHERS THETUBE"
		When I open the record for "NORTHERS THETUBE"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0020"
			And the PNC updates the record
