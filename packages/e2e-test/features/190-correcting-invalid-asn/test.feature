Feature: {190} R4.0_BR7_CC_TR_Offence Code Qualifiers

			"""
			{190} R4.0_BR7_CC_TR_Offence Code Qualifiers
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Matching where Offence Code 'Qualifiers' (i.e.
			ABCI variants) are received from Court.
			Specifically:
			- Message 1: Initial Court Results include an invalid ASN.
			An Exception created on the Portal which is corrected, resubmitted and matched with an existing Impending Prosecution Record on the PNC.
			The Offence from Court includes an Offence Qualifier (in this case "TH68011C") and this is not matched with the details of the Defendant on the PNC.
			An Exception is created to identify manual resolution as required.
			- Message 2: Initial Court Results include an invalid ASN.
			An Exception created on the Portal which is corrected, resubmitted and matched with an existing Impending Prosecution Record on the PNC.
			The Offence from Court includes an Offence Qualifier (in this case "TH68011A") and this is not matched with the details of the Defendant on the PNC.
			An Exception is created to identify manual resolution as required.

			MadeTech Definition:
			Correcting invalid ASN codes
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	@ExcludedOnConductor
	@NextUI
	Scenario: Correcting invalid ASN codes
		Given "input-message-1" is received
			And I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
			And there are no triggers raised for "fullerd Sam"
		When I open the record for "fullerd Sam"
			And I click the "Defendant" tab
			And I correct "ASN" to "0901VK0100000342547V"
			And I submit the record
			And I return to the list
		Then I see exception "HO100304" in the exception list table
		When "input-message-2" is received
		Then I see exception "HO100206" in the exception list table
			And there are no triggers raised for "fuller Sam"
		When I open the record for "fuller Sam"
			And I click the "Defendant" tab
			And I correct "ASN" to "0901VK0100000342547V"
			And I submit the record
			And I return to the list
		Then I see exception "HO100304" in the exception list table
			And the PNC record has not been updated
