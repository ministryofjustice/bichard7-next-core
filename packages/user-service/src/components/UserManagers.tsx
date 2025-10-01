import Details from "./Details"
import Paragraph from "./Paragraph"

type Props = {
  userManagerNames: string[]
}

const UserManagers = ({ userManagerNames }: Props) => (
  <>
    <Paragraph>
      {`If you have any queries about your permissions or you cannot see the resources you expect, please contact one of the user managers for your force.`}
    </Paragraph>

    <Details summary={"Who are the user managers in my force?"}>
      <ul className="govuk-!-margin-top-0" data-test="manager-list">
        {userManagerNames.map((um) => (
          <li key={um}>{um}</li>
        ))}
      </ul>
    </Details>
  </>
)

export default UserManagers
