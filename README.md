[![CircleCI](https://circleci.com/gh/neverendingqs/serverless-default-aws-resource-properties.svg?style=svg)](https://circleci.com/gh/neverendingqs/serverless-default-aws-resource-properties)
[![Coverage Status](https://coveralls.io/repos/github/neverendingqs/serverless-default-aws-resource-properties/badge.svg?branch=master)](https://coveralls.io/github/neverendingqs/serverless-default-aws-resource-properties?branch=master)
[![npm version](https://badge.fury.io/js/serverless-default-aws-resource-properties.svg)](https://badge.fury.io/js/serverless-default-aws-resource-properties)

# serverless-default-aws-resource-properties

**DEPRECATION NOTICE**: please use [serverless-default-aws-resource-attributes](https://github.com/neverendingqs/serverless-default-aws-resource-attributes) instead, as it supports a superset of the functionality provided by this plugin.
This plugin will no longer be maintained.

This plugin allows you to set default properties a given CloudFormation resource
should have based on type.

## Usage

Install the plugin:

```sh
npm install -D serverless-default-aws-resource-properties
```

Register the plugin in `serverless.yml`:

```yaml
plugins:
  - serverless-default-aws-resource-properties
```

Example:

```yaml
custom:
  defaultAwsProperties:
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
    # Add logging configuration to all S3 buckets except resource with
    # logical ID 'LoggingBucket'
    - Type: AWS::S3::Bucket
      Exclude:
        - LoggingBucket
      Properties:
        LoggingConfiguration:
          DestinationBucketName:
            Ref: LoggingBucket
```
