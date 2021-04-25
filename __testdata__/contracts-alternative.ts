import { version } from '../package.json';
import schema from './schema.json';
import { config } from './config';

const { identity } = config;
const { name, endpoint } = identity;

// This is our own contract that we are defining below...
// Add versioned endpoint, nested in version object?
const alt1 = [
  {
    [name]: {
      [version]: {
        schema,
        endpoint
        //dependents: []
      }
    }
  }
];

// ConsumerRelations/Dependents, separate concept from Test and Contract
// Top-level names are providers, and the list is their consumers
// Stored in persistence layer, and is updated when someone publishes data
// This means we can easily get which providers have which dependencies,
// but not which consumers have which dependencies.
const consumerRelations = {
  'api-provider': {
    '1.0.0': ['identity-service@2.1.5'],
    '1.0.1': ['some-provider@0.1.0']
  }
};
