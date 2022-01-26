import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy  from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

export class AwsIacStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Set up a bucket
    const websiteBucket = new s3.Bucket(this, 'GatsbyAlpBacket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html'  
    });

    // Loading up to bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../public')],
      destinationBucket: websiteBucket,
    });
    
    //
    new cloudfront.Distribution(this, 'myDist', {
      defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
    });
  

  }
}