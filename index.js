'use strict';

const _ = {
  merge: require('lodash.merge')
}

class DefaultAwsProperties {
  constructor(serverless) {
    this.provider = serverless.getProvider('aws');
    this.serverless = serverless.service;
    this.hooks = {
      'before:package:finalize': this.addDefaults.bind(this)
    };
  }

  getDefaults() {
    return this.serverless.custom.defaultAwsProperties || {};
  }

  mergeProperties({ original, additional }) {
    // Do not override anything in original
    return _.merge({}, additional, original);
  }

  addDefaults() {
    const defaults = this.getDefaults()
      .reduce(
        (acc, d) => {
          acc[d.Type] = (acc[d.Type] || []).concat([d]);
          return acc;
        },
        {}
      );

    const resources = this.serverless.resources.Resources;

    for(const [logicalId, resource] of Object.entries(resources)) {
      const { Type } = resource;
      const defaultsForType = defaults[Type];

      if(defaultsForType) {
        for(const d of defaultsForType) {
          const {
            Exclude: exclude,
            Properties: defaultPropertiesForType
          } = d;

          if(!exclude || !exclude.includes(logicalId)) {
            resource.Properties = this.mergeProperties({
              original: resource.Properties,
              additional: defaultPropertiesForType
            });
          }
        }
      }
    }
  }
}

module.exports = DefaultAwsProperties;
