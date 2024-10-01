Feature: {080} R4.1-BR7-Scenario AJ-Fixed Penalty Notice for Disorder (Dealt with at first hearing)

      """
      {080} R4.1-BR7-Scenario AJ-Fixed Penalty Notice for Disorder (Dealt with at first hearing)
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying Penalty Notice handling and Results (Judgement with Final Result) automation.
      An individual is issued with a fixed penalty notice for being drunk and disorderly by the police.
      A PenaltyNoticeCaseReference (which is actually the ‘FS/REF’ value on the PNC) is assigned.
      The individual may then subsequently elect to go to court.
      He is therefore summonsed (using the same ASN) to attend court.
      The individual appears at court, pleads guilty and is fined £100.
      The PNC response to the ASN query includes the information that this is a PND and the solution generates a PENHRG (the Arrest Summons Record on the PNC has a “PenaltyNoticeCaseReference” and so the Bichard7 solution must generate a PENHRG message in order to update the PNC).
      This result is classified as a “Judgement with Final Result” by the solution.

      MadeTech Definition: PNC is updated when there are multiple identical results

      Note: it is not possible to run this test on the PNC at the moment because there are multiple records for Peter Williams
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must @ExcludeOnPreProd @NextUI
  Scenario: PNC is updated when there are multiple identical results
    Given I am logged in as "supervisor"
      And I view the list of exceptions
    Then the PNC updates the record
      And the record for "Williams Peter" does not exist
