import type { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from "typeorm"

export type DatabaseQuery<T extends ObjectLiteral> = (QueryBuilder<T> & WhereExpressionBuilder) | WhereExpressionBuilder
