pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-west-2'
        AWS_ACCOUNT_ID = '348722393091'
        ECR_REPO_NAME = 'nodejs_project'
        ECS_CLUSTER_NAME = 'nodejs'
        ECS_SERVICE_NAME = 'nodejs_svc'
        ECS_TASK_FAMILY = 'nodejs_task'
    }

    stages {
        stage('checkout') {
            steps {
              git url: 'https://github.com/tejaswini1811/Nodejs_project.git',
                  branch: 'main'
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                script {
                    def dockerImage = docker.build("project_nodejs:${BUILD_NUMBER}")
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    docker.tag("nodejs", "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${ECR_REPO_NAME}")
                    docker.push("${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${ECR_REPO_NAME}")
                }
            }
        }
        stage('Create ECS Cluster') {
            steps {
                script {
                    sh "aws ecs create-cluster --cluster-name ${ECS_CLUSTER_NAME} --region ${AWS_DEFAULT_REGION}"
                }
            }
        }
        stage('Register Task Definition') {
            steps {
                script {
                    def taskDefinition = sh(script: "aws ecs register-task-definition --cli-input-json file://task-definition.json --region ${AWS_DEFAULT_REGION}", returnStdout: true).trim()
                    writeFile file: 'task-definition.json', text: """
                    {
                        "family": "${ECS_TASK_FAMILY}",
                        "containerDefinitions": [
                            {
                                "name": "your-container-name",
                                "image": "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${ECR_REPO_NAME}",
                                "cpu": 256,
                                "memory": 512,
                                "essential": true,
                                "portMappings": [
                                    {
                                        "containerPort": 3000,
                                        "hostPort": 3000
                                    }
                                ]
                            }
                        ]
                    }
                    """
                }
            }
        }
        stage('Run Task in ECS') {
            steps {
                script {
                    sh "aws ecs run-task --cluster ${ECS_CLUSTER_NAME} --task-definition ${ECS_TASK_FAMILY} --region ${AWS_DEFAULT_REGION}"
                }
            }
        }
    }
}
