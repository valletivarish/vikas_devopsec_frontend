# EC2 instance configuration (optional for serving frontend via Nginx)
# Primary deployment is via S3 static hosting, but EC2 can serve as a fallback

# Security group for optional EC2-based frontend serving
resource "aws_security_group" "frontend_sg" {
  name        = "survey-platform-frontend-sg"
  description = "Security group for optional frontend EC2 instance"
  vpc_id      = aws_vpc.main.id

  # Allow HTTP traffic on port 80 for Nginx
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access for frontend"
  }

  # Allow HTTPS traffic on port 443
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access for frontend"
  }

  # Allow SSH access for maintenance
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access for deployment"
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "survey-platform-frontend-sg"
  }
}

# AMI lookup for Amazon Linux 2023
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# Optional EC2 instance for frontend (primary deployment is S3)
resource "aws_instance" "frontend" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.frontend_sg.id]
  key_name               = var.key_pair_name

  # User data script to install Nginx for serving static files
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y nginx
              systemctl start nginx
              systemctl enable nginx
              EOF

  tags = {
    Name = "survey-platform-frontend"
  }
}
