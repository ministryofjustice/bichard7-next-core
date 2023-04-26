import type { Request, Response } from "express"
import type { DataSource } from "typeorm"
import getDataSource from "../services/getDataSource"
import listCourtCases from "../services/listCourtCases"
import type { CaseListQueryParams } from "src/types/CaseListQueryParams"

export const getCourtCases = async (req: Request, res: Response) => {
  try {
    const dataSource: DataSource = await getDataSource()
    const filter = req.query as unknown as CaseListQueryParams
    const data = await listCourtCases(dataSource, filter)

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
}
