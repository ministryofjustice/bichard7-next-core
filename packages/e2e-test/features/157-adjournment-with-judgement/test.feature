Feature: {157} BR7 R5.2.2-RCD518 - Result class Adjournment With Judgement

			"""
			{157} BR7 R5.2.2-RCD518 - Result class Adjournment With Judgement
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach Results automation (Adjournment With Judgement).
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Verification is made of the Breach updates to the PNC.
			No Pre Update Breach Trigger is generated despite the Offence meeting the criteria to generate it since there is no Sentence in the Results from Court (i.e.
			this is a Remand that has been received).

			MadeTech Definition:
			Correctly processing adjournment with judgement
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Correctly processing adjournment with judgement
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
