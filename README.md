# Nasomi Auctionhouse App

This is a simple mobile friendly web app which searches the Nasomi auction house. This application reuses the current Nasomi API enpoints to load the content; these may changed from time to time.

## First time setup

Once you have cloned / downloaded the repository simply run the following command to download the npm dependencies.

```
npm install
```

## Running locally

To get the application running locally use the following command.

```
npm start
```

To get the application running locally with debugging on use the following command.

```
npm run debug-application
```

The application will now be availble at:

```
https://localhost:3000/
```


## Deployment

Run the following commands to create a deployment using AWS Elastic Beanstalk. This will configure a node.js environment in the us-west-2 region. See the [full region list](https://docs.aws.amazon.com/general/latest/gr/rande.html#ec2_region) for other options.

If you need some help getting started with AWS check out the support area below.

```
eb init --platform node.js --region us-west-2
eb create --single --instance_type t2.nano --vpc.id vpc-XXXXXXXX --vpc.ec2subnets subnet-XXXXXXXX
```

Once the deployment has completed you can run the following command to view the deployed application.

```
eb open
```

## Amazon Web Services (AWS)

This guide walks you through deploying a sample application to Elastic Beanstalk using Elastic Beanstalk Command Line Interface (EB CLI) and git, and then updating the application to use the Express framework.

https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html

The Elastic Beanstalk Command Line Interface (EB CLI) is a command line client that you can use to create, configure, and manage Elastic Beanstalk environments. The EB CLI is developed in Python and requires Python version 2.7, version 3.4, or newer.

https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html

Install Python, pip, and the EB CLI on Windows

https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-windows.html
