Feature: {245} BR7 R5.6-RCD554-Existing Offence-Adj Post Judg-no PNC Adjudication

			"""
			{245} BR7 R5.6-RCD554-Existing Offence-Adj Post Judg-no PNC Adjudication
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying existing Offence behaviour and those changes to the Bichard7 solution brought about as part of RCD554.
			Court Hearing Results are received Adjourning all Offences after a Verdict has already been reached (i.e.
			Adjournment Post Judgement).
			However, at this point the PNC is unaware of the Verdict that has been reached and therefore holds no Adjudication for any of the Offences on the PNC.
			The Bichard7 solution recognises the mismatch of Verdicts details between the Court and the PNC and generates an "Inconsistent Result" Exception.
			No PNC update is made.

			MadeTech Definition:
			Raise exception for adjournment post judgement
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Raise exception for adjournment post judgement
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100325 (2)" in the exception list table
			And there are no triggers raised for "EXIOFFAPJNOPNCADJ EXCEPTION"
			And the PNC record has not been updated
