Feature: {148} BR7 R5.2-RCD452-Extracting Remand Date-Group 1

			"""
			{148} BR7 R5.2-RCD452-Extracting Remand Date-Group 1
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Crown Court Remand handling where the Next Hearing details are only present in the ResultText.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing a Remand (Adjournment With Judgement).
			However, the NextHearingDetails element contains no Next Hearing details.
			The solution recognises that these details (Date, Time and Location) are all present in the ResultText and the update to the PNC is generated based on this information instead.
			Successul update of the PNC is made.

			MadeTech Definition:
			Update PNC based on date time and location in result text
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Update PNC based on date time and location in result text
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
