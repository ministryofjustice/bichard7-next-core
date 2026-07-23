from cloudwatch_export import cloudwatch_export
from transform import transform


def lambda_handler(event, context) -> None:
    cloudwatch_export()
    transform()


if __name__ == "__main__":
    lambda_handler(None, None)
