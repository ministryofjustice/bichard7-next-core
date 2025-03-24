import styled from "styled-components"

export const LoadingSpinnerWrapper = styled.div`
  padding-top: 1.25rem;
`

export const LoadingSpinner = styled.div`
  @keyframes loading-spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  margin-left: auto;
  margin-right: auto;
  border: 12px solid #dee0e2;
  border-radius: 50%;
  border-top-color: #1d70b8;
  width: 80px;
  height: 80px;
  -webkit-animation: loading-spinner-animation 2s linear infinite;
  animation: loading-spinner-animation 2s linear infinite;
`

export const LoadingSpinnerContent = styled.div`
  padding-top: 1.25rem;
  text-align: center;
`
