Feature: {092} R4.1.1_BR7_CSV Report via Portal

      Tester can:
      - download reports

      """
      {092} R4.1.1_BR7_CSV Report via Portal
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying Work Allocation Report functionality which is currently used only by the Metropolitan Police.

      MadeTech Definition:
      This tests is to ensure that the LiveStatusSummary csv file can be downloaded from the reports section
      """

  @Must
  @Parallel
  Scenario: Supervisors can download reports
    Given I am logged in as "supervisor"
      And I navigate to the list of reports
    When I access the "Live Status Summary" report
      And I download the report
    Then the "LiveStatusSummary.csv" report will be downloaded as a CSV file
