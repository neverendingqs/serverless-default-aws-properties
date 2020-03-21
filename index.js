'use strict';

class DefaultAwsProperties {
  constructor(serverless) {
    this.provider = serverless.getProvider('aws');
    this.serverless = serverless.service;
    this.hooks = {
      'after:package:finalize': this.addDefaults.bind(this)
    };
  }

  addDefaults() {
  }
}

module.exports = DefaultAwsProperties;
