import getDataSource from "../../src/services/getDataSource"
import type { EntityTarget, ObjectLiteral } from "typeorm"

const deleteFromEntity = async (entity: EntityTarget<ObjectLiteral>) => {
  const dataSource = await getDataSource()

  return dataSource.getRepository(entity).createQueryBuilder().delete().execute()
}

export default deleteFromEntity
