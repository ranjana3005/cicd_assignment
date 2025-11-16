pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        REPO = "cicd-webapp"
        AWS_ACCOUNT_ID = "972775291931"
        ECR_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO}"
    }

    stages {

        stage('Fetch from GitHub') {
            steps {
                git branch: 'main', url: 'https://github.com/ranjana3005/cicd-webapp.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                docker build -t ${REPO}:latest .
                """
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: "aws-creds") {
                    bat """
                    aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin ${ECR_URL}
                    """
                }
            }
        }

        stage('Tag & Pubat Image to ECR') {
            steps {
                bat """
                docker tag ${REPO}:latest ${ECR_URL}:latest
                docker pubat ${ECR_URL}:latest
                """
            }
        }

        stage('Deploy on AWS ECS') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: "aws-creds") {
                    bat """
                    aws ecs update-service \
                        --cluster myCluster \
                        --service myService \
                        --force-new-deployment
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
