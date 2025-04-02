import nunjucks from "nunjucks"

nunjucks.configure({ autoescape: true })

const renderTemplate = <T extends object>(template: string, content: T) => {
  const renderedOutput = nunjucks.renderString(template, content)
  console.log("\n=== Preview Output ===\n")
  console.log(renderedOutput)
  return renderedOutput
}

export default renderTemplate
