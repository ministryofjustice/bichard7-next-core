import styled from "styled-components"
import { lightGrey, blue, white } from "utils/colours"

export const PaginationNav = styled.nav`
  justify-self: flex-end;
  align-self: flex-end;
  min-height: 50px;

  li {
    &.govuk-pagination {
      &__item {
        margin-top: 8px;

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
`
