"""
AWS S3 Bucket Synchronizer for Research Papers.
Provides automated upload, pull, and continuous background polling to sync
papers between an S3 bucket and the local ./watch_papers directory.
"""

import argparse
import os
from pathlib import Path
import time
from typing import Dict, List, Optional
import sys

# Safe console output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
except ImportError:
    boto3 = None

from config import WATCH_DIR


class S3PaperSync:
    """
    Manages two-way synchronization between an AWS S3 bucket and the local watch directory.
    """

    SUPPORTED_EXTENSIONS = {".docx", ".txt", ".md", ".pdf"}

    def __init__(self, bucket_name: Optional[str] = None, region_name: Optional[str] = None) -> None:
        if boto3 is None:
            raise ImportError("boto3 is not installed. Run 'pip install boto3' to enable S3 syncing.")

        self.bucket_name = bucket_name or os.environ.get("AWS_S3_BUCKET")
        self.region_name = region_name or os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
        self.s3_client = boto3.client("s3", region_name=self.region_name)
        self.watch_dir = WATCH_DIR
        self.watch_dir.mkdir(parents=True, exist_ok=True)
        # Track ETags to avoid redundant downloads: { filename: etag }
        self._etags: Dict[str, str] = {}

    def ensure_bucket_configured(self) -> str:
        if not self.bucket_name:
            raise ValueError(
                "AWS S3 Bucket name is not configured. "
                "Provide --bucket <name> or set environment variable AWS_S3_BUCKET."
            )
        return self.bucket_name

    def upload_local_papers(self, prefix: str = "papers/") -> int:
        """Upload all local papers in ./watch_papers to the S3 bucket."""
        bucket = self.ensure_bucket_configured()
        print(f"[S3 Sync] Uploading papers from '{self.watch_dir}' to 's3://{bucket}/{prefix}'...")
        count = 0

        for file_path in self.watch_dir.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in self.SUPPORTED_EXTENSIONS:
                if file_path.name.startswith("~$") or file_path.name.startswith("."):
                    continue
                s3_key = f"{prefix.rstrip('/')}/{file_path.name}"
                try:
                    self.s3_client.upload_file(str(file_path), bucket, s3_key)
                    print(f"  [+] Uploaded: {file_path.name} -> s3://{bucket}/{s3_key}")
                    count += 1
                except Exception as e:
                    print(f"  [!] Failed to upload {file_path.name}: {e}")

        print(f"[S3 Sync] Upload complete. {count} file(s) synchronized to S3.\n")
        return count

    def pull_s3_papers(self, prefix: str = "papers/") -> int:
        """Download new or modified papers from the S3 bucket into ./watch_papers."""
        bucket = self.ensure_bucket_configured()
        count = 0

        try:
            paginator = self.s3_client.get_paginator("list_objects_v2")
            pages = paginator.paginate(Bucket=bucket, Prefix=prefix)

            for page in pages:
                for obj in page.get("Contents", []):
                    key = obj["Key"]
                    etag = obj["ETag"].strip('"')
                    filename = Path(key).name

                    if not filename or Path(filename).suffix.lower() not in self.SUPPORTED_EXTENSIONS:
                        continue

                    local_path = self.watch_dir / filename

                    # Download if new or if ETag differs from known cache
                    needs_download = False
                    if not local_path.exists():
                        needs_download = True
                    elif self._etags.get(filename) != etag:
                        needs_download = True

                    if needs_download:
                        print(f"  [*] Downloading updated paper: s3://{bucket}/{key} -> {local_path.name}")
                        self.s3_client.download_file(bucket, key, str(local_path))
                        self._etags[filename] = etag
                        count += 1

        except ClientError as e:
            print(f"[S3 Sync Error] ClientError pulling from S3: {e}")
        except Exception as e:
            print(f"[S3 Sync Error] Error pulling from S3: {e}")

        return count

    def continuous_poll(self, poll_interval_sec: int = 15, prefix: str = "papers/") -> None:
        """Continuously monitor the S3 bucket and pull new or updated papers."""
        bucket = self.ensure_bucket_configured()
        print(f"[S3 Sync] Continuous S3 monitoring active on 's3://{bucket}/{prefix}' (polling every {poll_interval_sec}s)...")
        print("Press Ctrl+C to stop.\n")

        try:
            while True:
                pulled = self.pull_s3_papers(prefix=prefix)
                if pulled > 0:
                    print(f"[S3 Sync] Ingested {pulled} new/updated document(s) from S3 bucket.")
                time.sleep(poll_interval_sec)
        except KeyboardInterrupt:
            print("\n[S3 Sync] Stopped S3 polling.")


def main():
    parser = argparse.ArgumentParser(description="AWS S3 Research Paper Synchronizer")
    parser.add_argument("action", choices=["upload", "pull", "watch-s3"], help="Sync action")
    parser.add_argument("--bucket", type=str, default=None, help="S3 Bucket Name (or set AWS_S3_BUCKET env var)")
    parser.add_argument("--prefix", type=str, default="papers/", help="S3 folder prefix (default: papers/)")
    parser.add_argument("--region", type=str, default=None, help="AWS Region (default: us-east-1)")
    parser.add_argument("--interval", type=int, default=15, help="Polling interval in seconds for watch-s3 (default: 15)")

    args = parser.parse_args()

    try:
        syncer = S3PaperSync(bucket_name=args.bucket, region_name=args.region)
    except Exception as e:
        print(f"[Configuration Error] {e}")
        sys.exit(1)

    if args.action == "upload":
        syncer.upload_local_papers(prefix=args.prefix)
    elif args.action == "pull":
        syncer.pull_s3_papers(prefix=args.prefix)
    elif args.action == "watch-s3":
        syncer.continuous_poll(poll_interval_sec=args.interval, prefix=args.prefix)


if __name__ == "__main__":
    main()
