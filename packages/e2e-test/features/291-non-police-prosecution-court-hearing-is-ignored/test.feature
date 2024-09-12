Feature: {291} BR7-R5.8-RCD641 - Police Bail Variation Refused

			"""
			{291} BR7-R5.8-RCD641 - Police Bail Variation Refused
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Police Bail Variation Results by the Bichard7 solution.
			Non-Police Prosecution (NPPA) Court Hearing Results containing a Non-Recordable Offence and Refused Police Bail Variation Results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The entire Case is identified as of no interest to the PNC since the ASN is a Dummy ASN, the Offence is non-recordable and the results are therefore purposely ignored.

			MadeTech Definition:
			This tests that Bichard successfully ignores a non-police prosecution
			"""

	@Could
	Scenario: Non-Police prosecution court hearing is ignored
		Given "input-message" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
			And the audit log contains "Hearing Outcome ignored as no offences are recordable"
			And no PNC requests have been made
