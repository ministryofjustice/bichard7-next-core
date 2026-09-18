# 14. Analytical data store design

Date: 2026-09-07

## Status

Accepted

## Context

To improve Bichard we are continually asking more complex questions of our data. Remodelling the data is required to reduce the manual time/effort needed to answer these questions, or to make some answerable at all (e.g. a breakdown of total cases entering Bichard with certain result codes, by code and by month, for 2026). Depending on the outcome of the POC, it's possible that this datastore could be productionised and used to self-serve answers to common questions to stakeholders (i.e. dashboards), and to help with the next generation of in-system reporting.

Comprised of:

- data ingestion (i.e. ETL jobs)
- data storage
- data access (i.e. query engine(s))

## Decision

1. Focus on a POC first, before adding engineering rigor to enable stakeholder/user facing use cases
   - allows the internal Bichard team to gain insights quicker, prove out the data store, and work in an agile way
   - building a user facing data store straight away would take a long time to deliver value, and come with many unknowns
      - the POC would prove out data linking, and determine whether postgres needs to be included at all
   - without users/stakeholders depending on the data store, the schema can be iterated on quickly
   - using production data early will enable internal team members to gain valuable insights, while load testing the system with real volume/velocity of data

2. Build a derived data store (i.e. operational systems remain unchanged, data is replicated to the analytical data store)
   - heavy analytical queries don’t slow Bichard down (separate infrastructure)
   - freedom to choose a data storage format suited to analytics
   - freedom to transform/remodel the data into an analytics friendly schema
   - derived datasets can be deleted and recreated from the source data if needed
   - requires CDC (change data capture) from source systems to keep derived data up to date

3. POC to use manually triggered/scheduled python ecs tasks to ingest data
   - quick to implement
   - low cost (no cost when tasks aren't running, easy to right size cpu/memory)
   - levarages Data Engineer existing experience
   - low/no change needed to integrate with operational systems
   - easy to migrate to MoJ cloud platform if needed

4. Initial design to use delta tables in s3 as the storage format
   - designed for analytics 
   - low storage cost compared to traditional databases
   - good partitioning/chunking strategy can lead to lots of data skipping on query (less compute, quicker query time)
   - columnar format works well with analytical workloads (column skipping)
   - ACID compliant
   - Delta tables and the underlying parquet file format is open source, this opens up options for query engines, reduces vendor lock in

6. Use Athena for ad hoc queries
   - duckdb could have been used locally on team member's laptops. Free and simple to set up but poses a security risk, and requires lots of data transfer to/from S3
   - With AWS Athena, data doesn't leave the AWS account. Charged per GB scanned. The POC will help us understand the cost, and whether Athena would be inappropriate for production use cases

## Consequences

- Small anticipated cost to transform, store and query the analytical datasets
  - minimised by using s3 object storage
  - minimised by using on demand query engine(s)
  - Bichard naturally has relatively small data volumes (10s - 100s of GB)
- Duplication of data. Good CDC reduces/eliminates the risk of stale data. AWS provides CDC for DynamoDB and RDS.
- Untested/unvalidated data while we work through the POC. Clear "internal" naming and communication across the team ensures this is not used for operational/user facing workloads
  - can be superseeded in future once ready for wider consumption
