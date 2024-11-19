type BannerProps = {
  message: string
}

const Banner: React.FC<BannerProps> = ({ message }) => {
  return (
    <div aria-label="information" className="moj-banner" role="region">
      <svg
        className="moj-banner__icon"
        fill="currentColor"
        focusable="false"
        height="25"
        role="presentation"
        viewBox="0 0 25 25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v4.8
C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z"
        />
      </svg>

      <div className="moj-banner__message">
        <h2 className="govuk-heading-m">{message}</h2>
      </div>
    </div>
  )
}

export default Banner
