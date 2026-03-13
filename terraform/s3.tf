# S3 bucket configuration for hosting the React frontend as a static website
# Serves the built dist/ files via S3 static website hosting

resource "aws_s3_bucket" "frontend" {
  bucket = "survey-platform-frontend-${var.aws_region}"

  tags = {
    Name = "survey-platform-frontend-hosting"
  }
}

# Enable static website hosting with index.html as the default document
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  # SPA routing: serve index.html for all 404s (React Router handles routing)
  error_document {
    key = "index.html"
  }
}

# Enable versioning to keep deployment history
resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Allow public read access for the static website
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket policy allowing public read access to all objects
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.frontend]
}
