Feature: {034} R3.3_BR7_SPI ASN Validation - 2

			"""
			{034} R3.3_BR7_SPI ASN Validation
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation where differing ASN formats are received.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing ASNs in the following formats:
			- Including '/'s
			- With no leading zeros
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.

			MadeTech Definition:
			Validating correct ASN format
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Validating correct ASN format
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
