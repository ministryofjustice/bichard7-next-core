Feature: {169} BR7 R5.3-RCD513 - Some Offences Stop Listed

			"""
			{169} BR7 R5.3-RCD513 - Some Offences Stop Listed
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Ignored Offences handling (Ignored Offences with Recordable Results) where the Ignored Offence is present on the PNC and a Recordable Offence is Added In Court.
			Specifically:
			- Message 1: Offence 1 (Ignored Offence, Recordable Result) = Judgement With Final Result, Offence 2 Added In Court (Recordable Offence) = Judgement With Final Result
			PNC Update is generated for Offence 1 and the Court Hearing Results are successfully and automatically added onto the PNC.
			The 2nd Offence is added to the PNC.
			Pre Update Triggers are created on the Portal - this includes a Trigger (TRPR0006) for the Recordable Results received against the Ignored Offence.
			Post Update Triggers are created to identify the Offence Added In Court.
			All Triggers are Resolved via the Portal.

			MadeTech Definition:
			Ignored offence handling when some results are on the stop list
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: Ignored offence handling when some results are on the stop list
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PS10 - Offence added to PNC" in the exception list table
		When I open the record for "Mumm-Ra Terry"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0006"
			And I see trigger "TRPS0010" for offence "2"
		When I resolve all of the triggers
		Then the "record" for "Mumm-Ra Terry" is "resolved"
			And the "record" for "Mumm-Ra Terry" is not "unresolved"
			And there are no exceptions
