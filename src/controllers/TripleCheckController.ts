import { createNewTripleCheck } from '../entities/TripleCheck';
import { Config } from '../contracts/Config';

export async function TripleCheckController(config: Config) {
  const tripleCheck = await createNewTripleCheck(config);

  const { skipTestingLocalResources, skipTestingRemoteResources } = tripleCheck.config.tests;
  if (!(skipTestingLocalResources && skipTestingRemoteResources)) await tripleCheck.test();

  if (process.env.NODE_ENV === 'test') return tripleCheck;

  //await tripleCheck.publish();
}
