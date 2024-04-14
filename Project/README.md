# **PROJECT** 


* Create a Ubuntu OS EC2 Instance with keypair and Security group.
    
  ![preview](./Images/Image1.png)

* Connect The EC2 instance in Terminal using ssh. `ssh -i 'key' ubuntu@<publicip>`
  
  ![preview](./Images/Image2.png)

* Install Docker on EC2 Instance. 
 
  ![preview](./Images/Image3.png)

* Cloned the project from GIT.
 
  ![preview](./Images/Image4.png)

* Write a Dockerfile using `vi` and create a docker image using following command.
   ` docker image build -t project:1.0 . `
  
  ```
    FROM node:18-alpine

    WORKDIR /app

    COPY . .

    RUN npm install -g npm@10.5.2

    RUN npm install --force

    EXPOSE 3000

    CMD npm run dev
  ```

* Install AWS CLI on Instance then Configure the aws credentials.
  
  ![preview](./Images/Image5.png) 

* Create ECR Repository for storing the docker images. 

  ![preview](./Images/Image6.png)

* Push the docker image into ECR.

  ![preview](./Images/Image7.png)

  ![preview](./Images/Image8.png)

* Create ECS Cluster.

  ![preview](./Images/Image9.png)

* Create Taskdefinition.

  ![preview](./Images/Image10.png)

* Deploy the application.

  ![preview](./Images/Image11.png) 

* Browse the Apllication. ```http://<publicip>:3000``` 
  
  [browse the url] (http://3.0.146.158:3000/authentication/login) 

  ![preview](./Images/Image12.png)

   
   

   