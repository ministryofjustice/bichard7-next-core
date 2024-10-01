Feature: {266} BR7-R5.7-RCD603-AINT Result-Stop List Offence Added In Court

			"""
			{266} BR7-R5.7-RCD603-AINT Result-Stop List Offence Added In Court
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying AINT results handling:
			Court Hearing Results are sent through the CJSE and onto Bichard7 containing Libra AINT results for a Recordable Offence that is already on the PNC and for a Stop Listed Offence that was Added In Court.
			A Pre Update Trigger is created for the Recordable Offence only.
			No PNC updated is generated since the solution recognises that AINT results are of no interest to the Police.

			MadeTech Definition:
			Handling an AINT result that only contains offences on the stop list
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Handling an AINT result that only contains offences on the stop list
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC record has not been updated
			And there are no exceptions or triggers
