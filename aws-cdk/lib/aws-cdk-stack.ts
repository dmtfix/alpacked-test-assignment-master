import {
  Stack, StackProps, aws_s3, aws_s3_deployment, aws_cloudfront,
  aws_cloudfront_origins
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class AwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Set up a bucket
    const websiteBucket = new aws_s3.Bucket(this, 'Bucketforalp', {
      publicReadAccess: false,
      websiteIndexDocument: 'index.html'
    });

    // Loading up to bucket
    new aws_s3_deployment.BucketDeployment(this, 'DeployWebsite', {
      sources: [aws_s3_deployment.Source.asset('../public')],
      destinationBucket: websiteBucket,
    });

    // Allows CloudFront to reach the bucket
    new aws_cloudfront.OriginAccessIdentity(this, 'MyOriginAccessIdentity', {
      comment: 'Allows CloudFront to reach the bucket',
    });

    // Create Cloudfront
    new aws_cloudfront.Distribution(this, 'myDist', {
      defaultBehavior: { origin: new aws_cloudfront_origins.S3Origin(websiteBucket) },
    });


  }
}
