Feature: {260} BR7 R5.7-RCD611 - Bail Qualifier for Non Recordable & Ignored Offences

			"""
			{260} BR7 R5.7-RCD611 - Bail Qualifier for Non Recordable & Ignored Offences
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Code Qualifier to Bail Conditions translation:
			Court Hearing Results (Bail and Result Qualifier) are sent through the CJSE and onto Bichard7 containing results for a non-recordable offence that is already on the PNC and for a Stop Listed Offence that was Added In Court.
			A Pre Update Trigger is created for the non recordable Offence only.
			In addition the record appears in the Bail Conditions Report only for the non recordable Offence.
			The PNC is successfully updated with the results from Court for the non recordable Offence.
			The Offence Added In Court is ignored by the solution since it is a Stop Listed Offence.

			MadeTech Definition:
			Handling non-recordable bail conditions
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Handling non-recordable bail conditions
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And I see trigger "PR08 - Breach of bail" in the exception list table
		When I navigate to the list of reports
			And I access the "Bail Conditions" report
			And I generate today's report
		Then I see "01ZD0300108" in the report
			And the PNC updates the record
