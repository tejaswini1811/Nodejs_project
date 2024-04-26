pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="348722393091"
        AWS_DEFAULT_REGION="us-west-2"
	    CLUSTER_NAME="nodejs_test"
	    TASK_DEFINITION_NAME="nodejs_task"
	    DESIRED_COUNT="1"
        IMAGE_REPO_NAME="nodejs_project"
        //Do not edit the variable IMAGE_TAG. It uses the Jenkins job build ID as a tag for the new image.
        IMAGE_TAG="${env.BUILD_ID}"
        //Do not edit REPOSITORY_URI.
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
	    registryCredential = "aws"
        SERVICE_NAME = "nodejs-svc"
        VPC_ID ="vpc-0a729d0ec2b50a7ed"
        SUBNETS = "subnet-0581fca58af676215,subnet-0fdb63e26e3f22cf1"
        SECURITYGROUPS = "sg-0e2de29ec3748f13b"
        MIN_CAPACITY = "1"
        MAX_CAPACITY = "2"
          
    }
   
    stages {
        stage('checkout') {
            steps {
                git url: 'https://github.com/tejaswini1811/Nodejs_project.git',
                    branch: 'test'
            }
        }

        // Building Docker image
        stage('Building image') {
            steps{
                script {
                    dockerImage = docker.build "${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                }
            }
        }
        // Uploading Docker image into AWS ECR
        stage('Releasing') {
            steps{  
                script {
                    docker.withRegistry("https://" + REPOSITORY_URI, "ecr:${AWS_DEFAULT_REGION}:" + registryCredential) {
                                dockerImage.push()
                    }
                }
            }
        }
        // Cluster creation
        stage('Create ECS Cluster') {
            steps {
                sh "aws ecs create-cluster --cluster-name ${CLUSTER_NAME} --region ${AWS_DEFAULT_REGION}"
            }
        }
        // Creating the Task Definition
        stage('Register Task Definition') {
            steps {
                script {
                    writeFile file: 'task-definition.json', text: """
                    {
                        "family": "${TASK_DEFINITION_NAME}",
                        "containerDefinitions": [
                            {
                                "name": "nodejs_container",
                                "image": "${REPOSITORY_URI}:${IMAGE_TAG}",
                                "cpu": 0,
                                "portMappings": [
                                    {
                                        "name": "nodejs_port",
                                        "containerPort": 3000,
                                        "hostPort": 3000,
                                        "protocol": "tcp",
                                        "appProtocol": "http"
                                    }
                                ],
                                "essential": true,
                                "environment": [],
                                "environmentFiles": [],
                                "mountPoints": [],
                                "volumesFrom": [],
                                "ulimits": [],
                                "logConfiguration": {
                                    "logDriver": "awslogs",
                                    "options": {
                                        "awslogs-create-group": "true",
                                        "awslogs-group": "/ecs/${TASK_DEFINITION_NAME}",
                                        "awslogs-region": "${AWS_DEFAULT_REGION}",
                                        "awslogs-stream-prefix": "ecs"
                                    },
                                    "secretOptions": []
                                },
                                "systemControls": []
                            }
                        ],
                        "taskRoleArn": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole",
                        "executionRoleArn": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole",
                        "networkMode": "awsvpc",
                        "requiresCompatibilities": [
                            "FARGATE"
                        ],
                        "cpu": "1024",
                        "memory": "3072",
                        "runtimePlatform": {
                            "cpuArchitecture": "X86_64",
                            "operatingSystemFamily": "LINUX"
                        }
                    }
                    """
                    sh "aws ecs register-task-definition --cli-input-json file://task-definition.json --region ${AWS_DEFAULT_REGION}"
                }
            }
        }
        stage('Create Load Balancer') {
            steps {
                script {
                        // Creating an Application Load Balancer
                        def lb = sh(script: """
                            aws elbv2 create-load-balancer \
                                --name Nodejs-lb \
                                --subnets ${SUBNETS} \
                                --security-groups ${SECURITYGROUPS} \
                                --type network \
                                --ip-address-type ipv4 \
                                --scheme internet-facing
                            """, returnStdout: true).trim()
                        def lbArn = readJSON(text: lb).LoadBalancers[0].LoadBalancerArn

                        // Creating a target group
                        def tg = sh(script: """
                            aws elbv2 create-target-group \
                                --name ecs-tg \
                                --protocol TCP \
                                --port 3000 \
                                --vpc-id ${VPC_ID} \
                                --health-check-protocol HTTP \
                                --health-check-path / \
                                --target-type instance \
                                --ip-address-type ipv4
                            """, returnStdout: true).trim()
                        def tgArn = readJSON(text: tg).TargetGroups[0].TargetGroupArn

                        // Creating a listener
                        sh """
                            aws elbv2 create-listener \
                                --load-balancer-arn ${lbArn} \
                                --protocol TCP \
                                --port 3000 \
                                --default-actions Type=forward,TargetGroupArn=${tgArn}
                            """
                }
            }
        }
        stage('Deploy ECS Service') {
            steps {
                // Use the actual ARN or retrieve as done before
                // Creating or updating ECS service
                sh """
                    aws ecs create-service \
                        --cluster ${CLUSTER_NAME} \
                        --service-name ${SERVICE_NAME} \
                        --task-definition ${TASK_DEFINITION_NAME} \
                        --desired-count ${DESIRED_COUNT} \
                        --launch-type FARGATE \
                        --network-configuration "awsvpcConfiguration={subnets=[${SUBNETS}],securityGroups=[${SECURITYGROUPS}],assignPublicIp=ENABLED}" \
                        --load-balancers "targetGroupArn=${tgArn},loadBalancerName=Nodejs-lb,containerName=nodejs_container,containerPort=3000"
                    """
                sh """
                    aws application-autoscaling register-scalable-target \
                        --service-namespace ecs \
                        --scalable-dimension ecs:service:DesiredCount \
                        --resource-id service/${CLUSTER_NAME}/${SERVICE_NAME}\
                        --min-capacity ${MIN_CAPACITY} \
                        --max-capacity ${MAX_CAPACITY}
                    """                 
            }
        }
    }

        // Clear local image registry. Note that all the data that was used to build the image is being cleared.
        // For different use cases, one may not want to clear all this data so it doesn't have to be pulled again for each build.
   post {
       always {
       sh 'docker system prune -a -f'
       echo 'Deployment process completed.'
     }
   }
 }
