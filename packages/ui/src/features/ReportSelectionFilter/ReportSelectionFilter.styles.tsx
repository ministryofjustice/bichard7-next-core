import styled from "styled-components"

const ReportSelectionFilterWrapper = styled.div`
  .include-section-wrapper {
    flex: 1 1 15rem;
    min-width: 9rem;

    .checkboxes-wrapper {
      display: flex;

      .govuk-checkboxes__item {
        margin: 0;
        flex: 1 1 9rem;
        min-width: 9rem;
        max-width: 12.5rem;
      }

      .govuk-checkboxes__input {
        width: 40px;
        height: 40px;
      }

      .govuk-checkboxes__label::before {
        top: 0;
        left: 0;
      }

      .govuk-checkboxes__label::after {
        top: 11px;
        left: 9px;
      }
    }
  }

  .reports-section-wrapper {
    flex: 1 1 15rem;
    min-width: 9rem;

    .select-report-input {
      width: 100%;
    }
  }

  .date-range-section-wrapper {
    flex: 1 1 30rem;
    min-width: 9rem;
    justify-content: space-between;
    flex-direction: row;

    .date {
      min-width: 9rem;
      flex: 1 1 9rem;

      &:first-child {
        margin-right: 1.5rem;
      }
    }

    .calendars-wrapper {
      display: flex;
      flex-wrap: nowrap;
    }
  }

  .fields-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    align-items: flex-start;
    padding-left: 3rem;
    padding-right: 3rem;
    box-sizing: border-box;
  }

  .bottom-actions-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    width: 100%;

    .govuk-button {
      margin: 0;
    }

    .left-aligned {
      margin-right: auto;
    }
  }
`

const ResultsTableWrapper = styled.div`
  .reports-table {
    margin-top: 1rem;
  }
`

export { ReportSelectionFilterWrapper, ResultsTableWrapper }
