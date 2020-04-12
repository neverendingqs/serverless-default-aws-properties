const chai = require('chai');
const sinon = require('sinon');

const should = chai.should();

const DefaultAwsProperties = require('../index');

describe('DefaultAwsProperties', function() {
  beforeEach(function() {
    this.sandbox = sinon.createSandbox();

    this.serverless = {
      custom: {}
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
});
