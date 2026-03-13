# RDS PostgreSQL configuration (shared database, same as backend)
# Included for infrastructure completeness in the frontend repo

# Subnet group for RDS in private subnets
resource "aws_db_subnet_group" "main" {
  name       = "survey-platform-frontend-db-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = {
    Name = "survey-platform-frontend-db-subnet-group"
  }
}

# Security group for database access
resource "aws_security_group" "db_sg" {
  name        = "survey-platform-frontend-db-sg"
  description = "Security group for RDS PostgreSQL (frontend reference)"
  vpc_id      = aws_vpc.main.id

  # Allow PostgreSQL connections from the frontend security group
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend_sg.id]
    description     = "PostgreSQL access"
  }

  tags = {
    Name = "survey-platform-frontend-db-sg"
  }
}

# RDS PostgreSQL instance (mirrors backend configuration)
resource "aws_db_instance" "main" {
  identifier             = "survey-platform-frontend-db"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = var.db_instance_class
  allocated_storage      = 20
  storage_type           = "gp3"
  db_name                = "surveyplatform"
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = {
    Name = "survey-platform-frontend-db"
  }
}
