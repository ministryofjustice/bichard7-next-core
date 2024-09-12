Feature: {049} #191 - TRPS0008 Required for curfew orders (1052) NOT TRPR0003

			"""
			{049} #191 - TRPS0008 Required for curfew orders (1052) NOT TRPR0003
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result), BA Result Code
			Qualifier handling (catering for an error in the way that Electronic Tagging results are received from Libra
			whereby the Electronic Tagging Qualifier is specified against the Result for an Order and not against the
			Result which specifies a Requirement) and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing Judgement and Final Result
			information which also includes Electronic Tagging (BA Qualifier).
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried
			response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			PNC is verified to ensure Electronic Tagging details have been added correctly; in this case the Electronic
			Tagging will have been removed from the Result for the Order (1116) and added instead to the Result which specifies the Requirement (3105).
			Post Update Trigger is also successfully created on the Portal.

			MadeTech Definition:
			Insert the record into the pnc, validate there is a PS08 exception
			Interrogate the results, confirm both offence codes exist and the BA code is a qualifier for the results
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Ensure that a trigger is raised on Electronic Tagging and the qualifier is in the correct table
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS08 - Curfew order" for this record in the exception list
		When I open this record
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "1116" in the "CJS Code" row of the results table
			And I see "3105" in the "CJS Code" row of the results table
			And I see "BA" in the "Code" row of the results table
