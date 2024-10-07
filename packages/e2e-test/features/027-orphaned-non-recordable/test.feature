Feature: {027} R3.2_Orphaned Non-Recordable Offence

			"""
			{027} R3.2_Orphaned Non-Recordable Offence
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Orphaned Non-Recordable Offence handling.
			Court Hearing results are sent through the CJSE and onto Bichard7 withdrawing the 1st of 2x Offences.
			The remaining (Non-Recordable) Offence is Remanded.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			A second, Court Hearing result is sent through the CJSE and onto Bichard7.
			The solution recognises the Non-Recordable Offence as present on the PNC and successfully adds the results automatically onto the PNC.

			MadeTech Definition:
			This tests that no exceptions are created for Orphaned Non-Recordable offence
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI
	Scenario: No exceptions are created for orphaned non-recordable offence
		When "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
			And I view the list of exceptions
		Then there are no exceptions or triggers
			And the PNC updates the record
