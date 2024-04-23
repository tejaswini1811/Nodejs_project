pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="348722393091"
        AWS_DEFAULT_REGION="us-west-2"
	    CLUSTER_NAME="nodejs_test"
	    SERVICE_NAME="nodejs_svc"
	    TASK_DEFINITION_NAME="nodejs_task"
	    DESIRED_COUNT="1"
        IMAGE_REPO_NAME="nodejs_project"
        //Do not edit the variable IMAGE_TAG. It uses the Jenkins job build ID as a tag for the new image.
        IMAGE_TAG="${env.BUILD_ID}"
        //Do not edit REPOSITORY_URI.
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
	    registryCredential = "aws"
	    JOB_NAME = "project"
	    TEST_CONTAINER_NAME = "${JOB_NAME}-test-server"
    
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

        // Update task definition and service running in ECS cluster to deploy
        stage('Deploy') {
            steps{
                    withAWS(credentials: registryCredential, region: "${AWS_DEFAULT_REGION}") {
                        script {
                    sh "chmod +x -R ${env.WORKSPACE}"
                    sh './script.sh'
                        }
                    } 
                }
        }
        }
        // Clear local image registry. Note that all the data that was used to build the image is being cleared.
        // For different use cases, one may not want to clear all this data so it doesn't have to be pulled again for each build.
        post {
            always {
                sh 'docker system prune -a -f'
            }
        }
 }