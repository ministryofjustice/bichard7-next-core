Feature: {265} BR7-R5.7-RCD603-AINT Result-Offence Added In Court

			"""
			{265} BR7-R5.7-RCD603-AINT Result-Offence Added In Court
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying AINT results handling:
			Court Hearing Results are sent through the CJSE and onto Bichard7 containing Libra AINT results for a Recordable Offence that is already on the PNC and for an Offence that was Added In Court.
			Pre Update and Post Update Triggers are both created.
			No PNC updated is generated since the solution recognises that AINT results are of no interest to the Police.

			MadeTech Definition:
			AINT result with offence added in court
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: AINT result with offence added in court
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR23 - Domestic violence" in the exception list table
			And I see trigger "PS11 - Add offence to PNC" in the exception list table
			And there are no exceptions raised for "ADDEDOFFENCEAINT CASE"
			And the PNC record has not been updated
