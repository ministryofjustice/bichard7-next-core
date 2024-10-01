Feature: {236} BR7 R5.6-RCD597-Single CCR-Offences Adj Pre Judg-Adj With Judg-Offence Added In Court

			"""
			{236} BR7 R5.6-RCD597-Single CCR-Offences Adj Pre Judg-Adj With Judg-Offence Added In Court
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation of Offence Added In Court handling where existing Offences are Adjourned (Pre Judgement & With Judgement).
			Court Hearing results are sent through the CJSE and onto Bichard7 containing Remands (Pre Judgement & With Judgement) and an Offence Added In Court that has been resulted as Judgement With Final Result.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The Court Hearing Results are successfully added automatically onto the PNC.

			MadeTech Definition:
			Adding new offence in court where existing offences are adjourned
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Adding new offence in court where existing offences are adjourned
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And there are no exceptions raised for "OFFENCEADDED APJAWJ "
