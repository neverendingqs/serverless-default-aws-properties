[![CircleCI](https://circleci.com/gh/neverendingqs/serverless-default-aws-properties.svg?style=svg)](https://circleci.com/gh/neverendingqs/serverless-default-aws-properties)
[![npm version](https://badge.fury.io/js/serverless-default-aws-properties.svg)](https://badge.fury.io/js/serverless-default-aws-properties)

# serverless-default-aws-properties

This plugin allows you to set default properties a given CloudFormation resource
should have based on type.

## Usage

Install the plugin:

```sh
npm install -D serverless-default-aws-properties
```

Register the plugin in `serverless.yml`:

```yaml
plugins:
  - serverless-default-aws-properties
```

Example:

```yaml
custom:
  default-properties:
    # Enable SSE and block public access for all S3 buckets
    - Type: AWS::S3::Bucket
      Properties:
        BucketEncryption:
          ServerSideEncryptionConfiguration:
            - ServerSideEncryptionByDefault:
                SSEAlgorithm: AES256
        PublicAccessBlockConfiguration:
          BlockPublicAcls: true
          BlockPublicPolicy: true
          IgnorePublicAcls: true
          RestrictPublicBuckets: true
    # Add logging configuration to all S3 buckets except resource with logical
    # ID 'LoggingBucket'
    - Type: AWS::S3::Bucket
      Exclude:
        - LoggingBucket
      Properties:
        DestinationBucketName:
          Ref: LoggingBucket
```
