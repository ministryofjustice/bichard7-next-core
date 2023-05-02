import type { Response } from "express"
import type { DataSource } from "typeorm"
import getDataSource from "../services/getDataSource"
import listCourtCases from "../services/listCourtCases"
import type { CaseListQueryRequest } from "../../src/types/CaseListQueryRequest"

export const getCourtCases = async (req: CaseListQueryRequest, res: Response) => {
  const { caseListQueryParams } = req
  try {
    const dataSource: DataSource = await getDataSource()
    const data = await listCourtCases(dataSource, caseListQueryParams!)
    const responseCode = data instanceof Error ? 500 : 200

    res.status(responseCode).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
}
