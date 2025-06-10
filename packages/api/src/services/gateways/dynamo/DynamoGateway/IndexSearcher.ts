import type { Result } from "@moj-bichard7/common/types/Result"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type DynamoGateway from "./DynamoGateway"
import type { Projection } from "./DynamoGateway"
import type FetchByIndexOptions from "./FetchByIndexOptions"
import type KeyComparison from "./KeyComparison"
import type Pagination from "./Pagination"

export default class IndexSearcher<TResult> {
  private betweenKeyEnd?: unknown

  private betweenKeyStart?: unknown

  private filterKeyComparison?: KeyComparison

  private filterKeyName?: string

  private filterKeyValue?: unknown

  private hashKey: string

  private hashKeyValue: unknown

  private indexName: string

  private isAscendingOrder: boolean

  private lastItemForPagination?: Record<string, unknown>

  private limit? = 10

  private projection?: Projection

  private rangeKey?: string

  private rangeKeyComparison?: KeyComparison

  private rangeKeyValue?: unknown

  constructor(
    private gateway: DynamoGateway,
    private tableName: string,
    private partitionKey: string
  ) {}

  async execute(): PromiseResult<TResult | undefined> {
    const pagination: Pagination = {
      limit: this.limit
    }

    const lastItemKey = this.createLastItemKey()

    if (isError(lastItemKey)) {
      return lastItemKey
    }

    pagination.lastItemKey = lastItemKey

    const options: FetchByIndexOptions = {
      betweenKeyEnd: this.betweenKeyEnd,
      betweenKeyStart: this.betweenKeyStart,
      filterKeyComparison: this.filterKeyComparison,
      filterKeyName: this.filterKeyName,
      filterKeyValue: this.filterKeyValue,
      hashKeyName: this.hashKey,
      hashKeyValue: this.hashKeyValue,
      indexName: this.indexName,
      isAscendingOrder: this.isAscendingOrder,
      pagination,
      projection: this.projection,
      rangeKeyComparison: this.rangeKeyComparison,
      rangeKeyName: this.rangeKey,
      rangeKeyValue: this.rangeKeyValue
    }

    const fetchResult = await this.gateway.fetchByIndex(this.tableName, options)

    if (isError(fetchResult)) {
      return fetchResult
    }

    return <TResult | undefined>fetchResult.Items
  }

  paginate(
    limit?: number,
    lastItemForPagination?: Record<string, unknown> | unknown,
    isAscendingOrder = false
  ): IndexSearcher<TResult> {
    this.limit = limit
    this.lastItemForPagination = lastItemForPagination as Record<string, unknown>
    this.isAscendingOrder = isAscendingOrder
    return this
  }

  setBetweenKey(start: unknown, end: unknown): IndexSearcher<TResult> {
    this.betweenKeyStart = start
    this.betweenKeyEnd = end
    return this
  }

  setFilter(keyName: string, keyValue: unknown, comparison: KeyComparison): IndexSearcher<TResult> {
    this.filterKeyName = keyName
    this.filterKeyValue = keyValue
    this.filterKeyComparison = comparison
    return this
  }

  setIndexKeys(hashKey: string, hashKeyValue: unknown, rangeKey?: string): IndexSearcher<TResult> {
    this.hashKey = hashKey
    this.hashKeyValue = hashKeyValue
    this.rangeKey = rangeKey
    return this
  }

  setProjection(projection: Projection): IndexSearcher<TResult> {
    this.projection = projection
    return this
  }

  setRangeKey(rangeKeyValue: unknown, rangeKeyComparison: KeyComparison): IndexSearcher<TResult> {
    this.rangeKeyValue = rangeKeyValue
    this.rangeKeyComparison = rangeKeyComparison
    return this
  }

  useIndex(indexName: string): IndexSearcher<TResult> {
    this.indexName = indexName
    return this
  }

  private createLastItemKey(): Result<Record<string, unknown> | undefined> {
    if (!this.lastItemForPagination) {
      return undefined
    }

    const validationResult = this.validateLastItemForPagination()

    if (isError(validationResult)) {
      return validationResult
    }

    const lastItemKey = {
      [this.hashKey]: this.lastItemForPagination[this.hashKey],
      [this.partitionKey]: this.lastItemForPagination[this.partitionKey]
    }

    if (this.rangeKey) {
      lastItemKey[this.rangeKey] = this.lastItemForPagination[this.rangeKey]
    }

    return lastItemKey
  }

  private validateLastItemForPagination(): Result<void> {
    if (!this.lastItemForPagination) {
      return undefined
    }

    if (!this.lastItemForPagination.hasOwnProperty(this.partitionKey)) {
      return new Error(`lastItemForPagination does not contain '${this.partitionKey}' field`)
    }

    if (!this.lastItemForPagination.hasOwnProperty(this.hashKey)) {
      return new Error(`lastItemForPagination does not contain '${this.hashKey}' field`)
    }

    if (this.rangeKey && !this.lastItemForPagination.hasOwnProperty(this.rangeKey)) {
      return new Error(`lastItemForPagination does not contain '${this.rangeKey}' field`)
    }

    return undefined
  }
}
