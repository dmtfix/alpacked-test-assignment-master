import {
  Stack, StackProps, aws_s3, aws_s3_deployment, aws_cloudfront,
} from 'aws-cdk-lib';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class AwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Set up a bucket
    const websiteBucket = new aws_s3.Bucket(this, 'hellonewbucketforalpacked', {
      websiteIndexDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    });

    // Loading up to bucket
    new aws_s3_deployment.BucketDeployment(this, 'deploywebsite', {
      sources: [aws_s3_deployment.Source.asset('../public')],
      destinationBucket: websiteBucket,
    });

    // Allows CloudFront to reach the bucket?
    const oai = new aws_cloudfront.OriginAccessIdentity(this, 'myoriginaccessidentity', {
      comment: 'Allows CloudFront to reach the bucket',
    });
    websiteBucket.grantRead(oai);

    // Create Cloudfront
    new CloudFrontWebDistribution(this, 'mydist', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket,
            originAccessIdentity: oai
          },
          behaviors: [
            { isDefaultBehavior: true }
          ]
        }
      ]
    });
  }
}
