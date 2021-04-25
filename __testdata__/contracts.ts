import { version } from '../package.json';
import schema from './schema.json';
import { config } from './config';

const { identity } = config;
const { name, endpoint } = identity;

export = [
  {
    [name]: {
      [version]: schema,
      '1.0.0': schema,
      '1.0.1': schema,
      endpoint
    }
  },
  {
    'some-provider': {
      '1.0.0': {
        name: 123
      }
    }
  }
];
