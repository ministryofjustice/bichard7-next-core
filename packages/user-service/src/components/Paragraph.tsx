type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>

const Paragraph = (props: Props) => {
  const { children, ...inlineProps } = props
  return (
    <p {...inlineProps} className={props.className ? `govuk-body ${props.className}` : "govuk-body"}>
      {children}
    </p>
  )
}

export default Paragraph
