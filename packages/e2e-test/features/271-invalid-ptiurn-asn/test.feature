Feature: {271} BR7-R5.8-RCD502-503 - Remove extraneous ASN-MCR Exceptions

			"""
			{271} BR7-R5.8-RCD502-503 - Remove extraneous ASN-MCR Exceptions
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Exception generation.
			Court Hearing Results are sent through the CJSE and onto Bichard7 containing an invalid PTIURN and a structurally invalid ASN.
			The following Exceptions are not generated:
			- Invalid MCR (Magistrates Court Reference) Exception is not produced
			- Invalid Year, SequenceNumber and CheckDigit) Exceptions are not produced
			HO100206 (Bad ASN) and HO100201 (Bad PTIURN) are still produced.
			No PNC updated is generated and no Triggers are produced.

			MadeTech Definition:
			Raising exceptions for invalid PTIURN and ASN
			"""

	Background:
		Given "input-message" is received

	@Could
	Scenario: Raising exceptions for invalid PTIURN and ASN
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100201" in the exception list table
			And there are no triggers raised for "Filter Police"
		When I open the record for "Filter Police"
			And I click the "Case" tab
		Then I see error "HO100201 - Bad PTIURN format" in the "PTIURN" row of the results table
		When I click the "Defendant" tab
		Then I see error "HO100206 - Bad ArrestSummonsNumber" in the "ASN" row of the results table
		When I click the "Offences" tab
			And I view offence "1"
		Then I see error "HO100200 - Invalid Organisation Unit Code" in the "Defendant/Offender ASN Org Code" row of the results table
			And no PNC requests have been made
