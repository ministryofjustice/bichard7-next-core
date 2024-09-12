Feature: {261} BR7 R5.7-RCD611 - Bail Qualifier for Non Recordable Case

			"""
			{261} BR7 R5.7-RCD611 - Bail Qualifier for Non Recordable Case
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Code Qualifier to Bail Conditions translation:
			Court Hearing Results (Bail and Result Qualifier) are sent through the CJSE and onto Bichard7 containing only non-recordable offences generating no Exception on the Portal and no PNC Update.
			A Pre Update Trigger is however created and the record appears in the Bail Conditions Report.
			Since the solution (purposely) ignores the results (since PNC has no interest) a message is logged to the General Event Log.

			MadeTech Definition:
			Handling non-recordable bail conditions
			"""

	Background:
		Given the data for this test is not in the PNC
			And "input-message" is received

	@Should
	@PreProdTest
	Scenario: Handling non-recordable bail conditions
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And there are no exceptions
		When I navigate to the list of reports
			And I access the "Bail Conditions" report
			And I generate today's report
		Then I see "01ZD0300108" in the report
