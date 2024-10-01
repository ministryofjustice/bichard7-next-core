Feature: {110} BR7 R5.0-RCD385-PSA Code Change - part 1

			"""
			{110} BR7 R5.0-RCD385-PSA Code Change
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the handling of Court Hearing Results where a Court sits inside another Court's building, Results automation (Judgement with Final Results) and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The solution ensures an accurate update to the PNC by recognising that the details of the Court are of those that sits inside another Court's building.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Post Update Triggers are also generated.

			MadeTech Definition:
			PSA code change handling
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: PSA code change handling
		Given I am logged in as "met.police"
			And I view the list of exceptions
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And there are no exceptions raised for "CHANGES PSACODE"
			And the PNC updates the record
