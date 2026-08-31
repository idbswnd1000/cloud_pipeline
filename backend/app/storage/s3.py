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

    def _build_key(self, path: str = "") -> str:
        path = path.strip("/")

        if not path:
            return self.prefix

        return f"{self.prefix}/{path}"

    def list_folders(self, folder_name: str = "") -> list[str]:
        prefix = self._build_key(folder_name).rstrip("/") + "/"

        response = self.s3.list_objects_v2(
            Bucket=self.bucket,
            Prefix=prefix,
            Delimiter="/",
        )

        folders = []

        for item in response.get("CommonPrefixes", []):
            full_prefix = item["Prefix"].rstrip("/")
            folder_name = full_prefix.split("/")[-1]
            folders.append(folder_name)

        return folders

    def list_files(self, folder_name: str) -> list[str]:
        prefix = self._build_key(folder_name).rstrip("/") + "/"

        response = self.s3.list_objects_v2(
            Bucket=self.bucket,
            Prefix=prefix,
        )

        files = []

        for item in response.get("Contents", []):
            key = item["Key"]

            if key.endswith("/"):
                continue

            files.append(key)

        return files

    def get_presigned_url(
        self,
        s3_path: str,
        expires_in: int = 3600,
    ) -> str:
        key = self._build_key(s3_path)

        return self.s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": self.bucket,
                "Key": key,
            },
            ExpiresIn=expires_in,
        )


s3_storage = S3Storage()