# Input variables for the Survey Platform frontend infrastructure

variable "aws_region" {
  description = "AWS region for deploying frontend infrastructure"
  type        = string
  default     = "eu-west-1"
}

variable "instance_type" {
  description = "EC2 instance type for optional frontend server"
  type        = string
  default     = "t2.micro"
}

variable "key_pair_name" {
  description = "Name of the AWS EC2 key pair for SSH access"
  type        = string
  default     = "survey-platform-key"
}

variable "db_instance_class" {
  description = "RDS instance class for the PostgreSQL database"
  type        = string
  default     = "db.t3.micro"
}

variable "db_username" {
  description = "Master username for the RDS database"
  type        = string
  default     = "default"
  sensitive   = true
}

variable "db_password" {
  description = "Master password for the RDS database"
  type        = string
  default     = "root"
  sensitive   = true
}
