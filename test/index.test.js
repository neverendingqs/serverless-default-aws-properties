const chai = require('chai');
const sinon = require('sinon');

const should = chai.should();

const DefaultAwsProperties = require('../index');

describe('DefaultAwsProperties', function() {
  beforeEach(function() {
    this.sandbox = sinon.createSandbox();

    this.serverless = {
      custom: {},
      resources: {}
    };
    this.defaultAwsProperties = new DefaultAwsProperties({
      getProvider: this.sandbox.stub(),
      service: this.serverless
    });
  });

  afterEach(function() {
    this.sandbox.verifyAndRestore();
  });

  describe('constructor()', function() {
    it('hooks are set properly', function() {
      should.exist(this.defaultAwsProperties.hooks);

      const hook = this.defaultAwsProperties.hooks['before:package:finalize'];
      should.exist(hook);

      hook.should.be.a('function');
      hook.name.should.equal('bound addDefaults');
    });
  });

  describe('getDefaults()', function() {
    it('returns empty object if no defaults are configured', function() {
      this.defaultAwsProperties.getDefaults()
        .should.deep.equal({});
    });

    it('returns defaults if configured', function() {
      const defaults = [
        {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketEncryption: {
              ServerSideEncryptionConfiguration: [
                {
                  ServerSideEncryptionByDefault: {
                    SSEAlgorithm: 'AES256'
                  }
                }
              ]
            },
            PublicAccessBlockConfiguration: {
              BlockPublicAcls: true,
              BlockPublicPolicy: true,
              IgnorePublicAcls: true,
              RestrictPublicBuckets: true
            }
          }
        }
      ];

      this.serverless.custom.defaultAwsProperties = defaults

      this.defaultAwsProperties.getDefaults()
        .should.deep.equal(defaults);
    });
  });

  describe('mergeProperties()', function() {
    it('priorities original properties over new ones', function() {
      const original = {
        inBoth: {
          inAdditionalAsWell: 'original',
          inOriginal: 'only',
          inOriginalAsWell: 'original'
        }
      };

      const additional = {
        inBoth: {
          inAdditional: 'only',
          inAdditionalAsWell: 'additional',
          inOriginalAsWell: 'additional'
        }
      }

      this.defaultAwsProperties.mergeProperties({ original, additional })
        .should.deep.equal({
          inBoth: {
            inAdditional: 'only',
            inAdditionalAsWell: 'original',
            inOriginal: 'only',
            inOriginalAsWell: 'original'
          }
        });
    });
  });

  describe('addDefaults()', function() {
    it('excludes resources based on type or logical ID', function() {
      const defaultProperties = {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256'
              }
            }
          ]
        },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true
        }
      };

      this.serverless.custom.defaultAwsProperties = [
        {
          Type: 'AWS::S3::Bucket',
          Exclude: [
            'IgnoredBucket'
          ],
          Properties: defaultProperties
        }
      ];

      this.serverless.resources.Resources = {
        IgnoredBucket: {
          Type: 'AWS::S3::Bucket',
          Properties: {}
        },
        NotABucket: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {}
        },
        RegularBucket: {
          Type: 'AWS::S3::Bucket',
          Properties: {}
        }
      };

      this.defaultAwsProperties.addDefaults();

      this.serverless.resources.Resources.IgnoredBucket.Properties
        .should.not.have.property('BucketEncryption');

      this.serverless.resources.Resources.NotABucket.Properties
        .should.not.have.property('BucketEncryption');

      this.serverless.resources.Resources.RegularBucket.Properties
      .should.deep.include(defaultProperties);
    });
  });
});
