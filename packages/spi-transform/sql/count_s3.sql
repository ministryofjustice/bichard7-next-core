-- ad hoc script used to efficiently count messages in the conductor and legacy incoming messages buckets
SELECT
    count(DISTINCT file) AS n_messages
FROM
    glob(
        [
            's3://bichard-7-production-conductor-internal-incoming-messages/2024/**/*.xml',
            's3://bichard-7-production-internal-incoming-messages/2024/**/*.xml'
        ]
    );