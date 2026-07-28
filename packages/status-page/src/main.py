from src.cloudwatch_export import cloudwatch_export
from src.transform import transform


def handler(event, context) -> None:
    cloudwatch_export()
    transform()


if __name__ == "__main__":
    handler(None, None)
