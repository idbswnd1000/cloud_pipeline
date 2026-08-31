import boto3

from app.config import settings


class S3Storage:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            region_name=settings.aws_region,
        )

        self.bucket = settings.s3_bucket_name
        self.prefix = settings.s3_image_prefix.strip("/")

    # CRUD 함수들...


s3_storage = S3Storage()