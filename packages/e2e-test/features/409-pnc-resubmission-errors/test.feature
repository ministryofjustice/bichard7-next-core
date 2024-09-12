Feature: {409} BR7-R5.7-RCD603-AINT Result-Exception generation

			"""
			{409} BR7-R5.7-RCD603-AINT Result-Exception generation
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying AINT results handling:
			Court Hearing Results are sent through the CJSE and onto Bichard7 containing Libra AINT results for a Recordable Offence that is already on the PNC and for a Stop Listed Offence that was Added In Court.
			An Exception is generated.
			A Pre Update Trigger is created for the Recordable Offence only.
			The Exception (bad PNCID format) is corrected and the Exception resubmitted from the Portal.
			No PNC updated is generated since the solution recognises that AINT results are of no interest to the Police.

			MadeTech Definition:
			Verifying AINT results generate no PNC update

			TODO
			This test is copied from test 264 and probably needs a better description.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@ExcludeOnPreProd
	Scenario: Handling unexpected errors for PNC update after resubmission
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100209" in the exception list table
			And there are no triggers raised for "EXCEPTIONAINT CASE"
		When I open the record for "EXCEPTIONAINT CASE"
			And I click the "Defendant" tab
			And I correct "Court PNCID" to "2013/0000016P"
			And I submit the record
			And I return to the list
		Then I see exception "HO100314" in the exception list table
