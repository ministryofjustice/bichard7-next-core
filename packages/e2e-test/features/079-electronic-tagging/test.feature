Feature: {079} R4.0.6_BR7_BA qualifier applied to curfew order result

			"""
			{079} R4.0.6_BR7_BA qualifier applied to curfew order result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Electronic Tagging (catering for an error in the way that Electronic Tagging results are received from Libra whereby the Electronic Tagging Qualifier is specified against the Result for an Order and not against the Result which specifies a Requirement), Suspended Sentence and Curfew Order Results handling, Results automation and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The solution ensures that Disposal Date values for specific Result Codes (3105) are stripped out of the update to the PNC.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			PNC is verified to ensure Electronic Tagging details have been added correctly; in this case the Electronic Tagging will have been removed from the Result for the Order (1115) and added instead to the Result which specifies the Requirement (3105).
			Post Update Triggers are also generated.

			MadeTech Definition:
			Correctly handling electronic tagging results
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Correctly handling electronic tagging results
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS08 - Curfew order" in the exception list table
			And there are no exceptions raised for "Ben Mister"
