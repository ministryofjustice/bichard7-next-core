import styled from "styled-components"
import { lightGrey, blue, white } from "utils/colours"

export const PaginationNav = styled.nav`
  justify-self: flex-end;
  align-self: flex-end;
  min-height: 50px;

  ul {
    align-items: flex-end;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;

    li {
      &.govuk-pagination {
        &__item {
          margin-top: 3px;

          &:hover {
            background-color: ${lightGrey};
          }

          &--current {
            color: ${white};

            &,
            &:hover {
              background-color: ${blue};
            }
          }

          &--ellipsis:hover {
            background-color: transparent;
          }
        }

        &__next:hover,
        &__prev:hover {
          background-color: ${lightGrey};
        }
      }
    }
  }
`
