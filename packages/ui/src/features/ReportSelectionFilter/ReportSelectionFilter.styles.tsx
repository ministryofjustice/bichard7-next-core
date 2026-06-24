import styled from "styled-components"

const ReportSelectionFilterWrapper = styled.div`
  .include-section-wrapper,
  .resolved-by-section-wrapper,
  .reports-section-wrapper {
    flex: 1 1 15rem;
    min-width: 9rem;
  }

  .include-section-wrapper {
    .checkboxes-wrapper {
      display: flex;

      .govuk-checkboxes__item {
        margin: 0;
        flex: 1 1 9rem;
        min-width: 9rem;
        max-width: 12.5rem;
      }

      .govuk-checkboxes__input {
        width: 2.5rem;
        height: 2.5rem;
      }

      .govuk-checkboxes__label {
        &::before {
          top: 0;
          left: 0;
        }
        &::after {
          top: 11px;
          left: 9px;
        }
      }
    }
  }

  .reports-section-wrapper {
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
      flex: 1 1 9rem;
      min-width: 9rem;

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
    padding: 0 3rem;
    box-sizing: border-box;
  }
`

export { ReportSelectionFilterWrapper }
