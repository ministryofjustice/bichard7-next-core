Feature: {041} R3.3_BR7_Operational Trigger Report

			"""
			{041} R3.3_BR7_Operational Trigger Report
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying a specific Operational Report providing a live summary allowing a manager to to see those Triggers that are unresolved after 7 Days.

			MadeTech Definition:
			Generating the operational trigger report

			Note: this test does not run against the Host 9 PNC because it uses the same records as other tests so would clash
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@ExcludeOnPreProd
	@ExcludedOnConductor
	Scenario: Generating the operational trigger report
		Given "input-message-1" is received
			And "input-message-2" is received
		When I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "PR03" in the exception list table
			And I see trigger "PR06" in the exception list table
		When I fake the data for the operational trigger report
			And I click the "Reports" menu button
			And I access the "Live Status Detail - Triggers" report
			And I click the "Run report" button
		Then I see "EXONEA EXCEPTION" in the report
			And I see "TRTHREE TRPRTWELVE" in the report
