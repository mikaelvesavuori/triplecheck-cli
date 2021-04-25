export type ConsumerContract = {
  name: Contract; //[name]
};

export type ProviderContract = {
  name: Contract; //[name]
};

export type ConsumerTest = {
  name: Contract; //[name]
  //serviceName: string;
  //tests: ConsumerContract[];
};

type Contract = {
  version: string; //[version]
};
