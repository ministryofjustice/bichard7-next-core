Feature: {290} BR7-R5.8-RCD641 - Police Bail Variation Granted

			"""
			{290} BR7-R5.8-RCD641 - Police Bail Variation Granted
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Police Bail Variation Results by the Bichard7 solution.
			Police Prosecution (PPA) Court Hearing Results containing a Non-Recordable Offence and Granted Police Bail Variation Results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The entire Case is identified as of no interest to the PNC since the ASN is a Dummy ASN, the Offence is non-recordable and the results are therefore purposely ignored.
			The Bail Conditions Trigger is generated and the Case appears as part of the Bail Conditions Report.
			The "Personal details changed" Trigger is also produced.

			MadeTech Definition:
			Bail conditions trigger on non-recordable offence
			"""

	Background:
		Given "input-message" is received

	@Could
	Scenario: Bail conditions trigger on non-recordable offence
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And I see trigger "PR15 - Personal details changed" in the exception list table
		When I navigate to the list of reports
			And I access the "Bail Conditions" report
			And I generate today's report
		Then I see "00PP0000008" in the report
			And no PNC requests have been made
