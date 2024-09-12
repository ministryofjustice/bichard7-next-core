Feature: {114} BR7 R5.1-RCD384-395-Stop checking Result Code Qualifiers against Result Codes

			"""
			{114} BR7 R5.1-RCD384-395-Stop checking Result Code Qualifiers against Result Codes
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the Result Code Qualifiers Stop List and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			Result Code Qualifiers meeting the following conditions are verified against the update made to the PNC:
			- IS valid for the Result Code AND is present in the stopList.properties file
			- IS valid for the Result Code but is NOT present in the stopList.properties file
			- is NOT valid for the Result Code but is NOT present in the stopList.properties file
			Pre Update Triggers are also created.

			MadeTech Definition:
			Checking result codes against the stop list
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Checking result codes against the stop list
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions raised for "Qualifiers ResultCode"
			And the PNC updates the record
