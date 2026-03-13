# Output values for the Survey Platform frontend infrastructure

output "frontend_website_url" {
  description = "S3 static website URL for the frontend application"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "frontend_bucket_name" {
  description = "Name of the S3 bucket hosting the frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_ec2_public_ip" {
  description = "Public IP of the optional frontend EC2 instance"
  value       = aws_instance.frontend.public_ip
}

output "frontend_ec2_public_dns" {
  description = "Public DNS of the optional frontend EC2 instance"
  value       = aws_instance.frontend.public_dns
}

output "rds_endpoint" {
  description = "RDS PostgreSQL connection endpoint"
  value       = aws_db_instance.main.endpoint
}

output "rds_database_name" {
  description = "Name of the PostgreSQL database"
  value       = aws_db_instance.main.db_name
}
