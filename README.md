# triplecheck-cli

## TripleCheck CLI — The easiest and fastest way to do contract testing.

Easy contract testing for Node (TS, JS).

I love the idea of Pact, but I get nervous around it: I personally find it a bit too much, too daunting and too involved in its workflow. I also admit that I have therefore not given it any real testing, in a demo project or otherwise. I don't consider myself either a super-engineer nor a novice, but that criticism against Pact is hopefully at least somewhat valid.

One of the things I absolutely wanted to improve was the DX (developer experience), beyond just making this a new pet project.

If you are coming from Pact, you will probably see a lot of things missing—some I know, some I don't.

## Development flow

The approach with TripleCheck may be more naive than with Pact. In TripleCheck, there is no forced two-way verification, so any change you make will not start any other processes. It's really just like a lightweight mocked integration test.

Below I will list two typical cases. Of course a system/service/app/API can have _both_ dependents and dependencies.

### One contract per service

Each service should abide by one contract. This contract may have multiple versions.

### One local test file

All tests are collected in a single file. This can contain tests for any number of services and versions.

### Use the remote collections of tests and contracts

Make sure to publish collections to the remote data storage. Only keep locally the minimum number of things you need. For a typical provider it would be your own service (provider) contract and your tests.

Use `testScope` and `excludeScope` in the configuration to decide what you actually need to test.

### Consumer updates their application that depends on an API

TODO.

### Provider updates their API that has several applications depending on it

TODO.

## Terminology

- Test/verify: When you test compatibility between two or more contracts
- Publish contract: When you make a local contract public (adding/updating) in the shared data source

## Design goals

- Prefers ease over rich functionality
- As close to zero config as possible
- Support any kind of infra and data sources
- First-grade support for modern CI tools and serverless
- Removes the need for a heavyweight broker
- Lightweight: no need to mock or make actual requests, TripleCheck will compare static typed contracts
- Note: Compared to Pact, TripleCheck does not make it possible to make deep asserts (like an expected response), it only ensures type and schema consistency

## Features

- Explicit testing: you test your contracts as you do with any regular test
- Implicit testing: if you provide your use patterns, dynamic testing can be done and both ways (provider and consumer) can be validated without any formal test
- Examples for pushing/pulling data to AWS S3, GCP bucket, Azure bucket incl permissions in pipeline
- TripleCheck will only use, merge, test data and download it - it will not upload it
- Provide ready pipeline examples (and steps/actions?) for AWS CodePipeline, Github, Bitbucket, Cloud Build, Azure DevOps
- One step deploy a visualizer to Cloudflare Pages or Netlify or Vercel

## References

- https://www.fastify.io/docs/v2.2.x/Validation-and-Serialization/
- https://github.com/pact-foundation/pact-js/blob/master/examples/graphql/src/consumer.spec.ts
- https://docs.pact.io/getting_started/how_pact_works
- https://docs.pact.io/5-minute-getting-started-guide/
- https://github.com/pact-foundation/pact-js/tree/master/examples/e2e
- https://blog.dennisokeeffe.com/blog/2020-09-20-generating-types-with-quicktype/
- https://json-schema.org/understanding-json-schema/structuring.html
