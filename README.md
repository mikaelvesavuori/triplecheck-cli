# triplecheck-cli

## TripleCheck CLI — The easiest and fastest way to do contract testing.

![Build Status](https://github.com/mikaelvesavuori/triplecheck-cli/workflows/main/badge.svg)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mikaelvesavuori_triplecheck-cli&metric=alert_status)](https://sonarcloud.io/dashboard?id=mikaelvesavuori_triplecheck-cli)

[![CodeScene Code Health](https://codescene.io/projects/15674/status-badges/code-health)](https://codescene.io/projects/15674)

[![CodeScene System Mastery](https://codescene.io/projects/15674/status-badges/system-mastery)](https://codescene.io/projects/15674)

Contract testing should be as easy and painless as unit testing, yet it never really seems to be. TripleCheck tries to remove as much of the pain as possible.

The three key features of the TripleCheck eco-system are:

1. **Smooth-as-melted-icecream two-way continuous testing**, meaning all parties do testing of their dependencies and dependents, puts an end to "consumer driven contracts": what we always wanted was that all sides verify respective integrity, not necessarily deep dialogues on who "drives" contracts/interfaces;
2. Broker ("server") acting as an (optional) lightweight **global collection of all existing tests and contracts**;
3. Practically turnkey solutions ready-to-go, for common modern toolchains/architectures.

[TODO]

## Design goals

- Ease over rich functionality: should require minimal effort to learn and operate
- First grade support for serverless compute (Lambda, Cloud Run...) and databases (Fauna, Dynamo, Firestore...)
- First-grade support for modern CI tools (GitHub Actions, cloud provider's toolchains..)
- Day 1 support for modern message brokers (Google Pub/Sub, AWS Eventbridge...)
- Remove the need for a _heavyweight_ broker
- Ideally zero config
- Lightweight: no need to mock or make actual requests, TripleCheck will compare static typed contracts
- Support any kind of infra and data sources

Compared to Pact, TripleCheck cannot make deep syntactic asserts (like an expected response body), it can only ensure type and schema consistency. This is—I find—to be the true scope of contract testing. Tools like Pact are capable but, at least according to me, do too much.

## A demo case

TripleCheck CLI allows you to run tests by verifying [JSON Schemas](https://json-schema.org) and/or plain objects that represent contracts against test objects. An example contract (plain object style) could be:

```
[
  {
    "user-api": {
      "1.0.0": {
        "name": "Someone",
        "address": "Some Street 123",
        "age": 35
      }
    }
  }
]
```

In our list of contracts, we've provided `user-api` with version `1.0.0` and the three fields that it expects.

A basic test (again, a plain object) to verify schema integrity could look like:

```
[
  {
    "user-api": {
      "1.0.0": [
        {
          "Verify identity": {
            "name": "Carmen",
            "address": "Ocean View 3000",
            "age": 27
          }
        }
      ]
    }
  }
]
```

To test the contract, we construct an array of tests for any services and their versions. This makes it easy to co-locate both contracts and tests in single files, or to assemble them programmatically. You can use a combination of local and/or remote tests and contracts.

Notice that the exact syntax is not validated, but instead the shape [TODO: Syntax vs Semantics]. Under the hood TripleCheck uses [Quicktype](https://quicktype.io) to do this checking. It's recommended to use [JSON Schema](https://json-schema.org) for more complex usecases. It also makes it easier to be concrete about actual types and what fields are required.

## Terminology

- Test/verify: When you test compatibility between two or more contracts
- Publish contract: When you make a local contract public (adding/updating) in the shared data source

## Workflow

Contracts should be "owned" by the respective services. The individual service is primarily responsible for creating, updating and publishing their contract.

Tests can be written by anyone who has a dependency toward a given service.

Send back data, having resolved dependencies, given that someone has already published contracts and tests (and that dependencies / dependents have been calculated) you'll get all related data back.

- **You get back data for your service**: Ensure functionality of what others need of you
- **You get back data for services you depend on**: Ensure functionality of what you need of others

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

## Example broker implementations

There are several broker implementations that you can use right away or as the basis of your own starter kit. The current list is:

- [Google Cloud Run and Firestore](https://github.com/mikaelvesavuori/triplecheck-example-cloudrun)
- [Google Cloud Functions and Firestore](https://github.com/mikaelvesavuori/triplecheck-example-cloud-functions)
- [Cloudflare Workers and KV](https://github.com/mikaelvesavuori/triplecheck-example-cloudflare-workers)
- [AWS Lambda with DynamoDB](https://github.com/mikaelvesavuori/triplecheck-example-lambda)
- [Vercel with FaunaDB](https://github.com/mikaelvesavuori/triplecheck-example-vercel)
- [Netlify with FaunaDB](https://github.com/mikaelvesavuori/triplecheck-example-netlify)

Read more over at [triplecheck-broker](https://github.com/mikaelvesavuori/triplecheck-broker) for details on these.

## Sync schemas from AWS EventBridge and Google Cloud Platform Pub/Sub

Add one/both of these to your `package.json` scripts:

```
"sync:aws": "sh node_modules/triplecheck-cli/generate-schemas-from-aws.sh your-registry-name",
"sync:gcp": "sh node_modules/triplecheck-cli/generate-schemas-from-gcp.sh"
```

Don't forget to change your registry name if you want to use the AWS option.

Note that the shell scripts have no logic and will not take any options from your TripleCheck configuration. Feel free to copy and modify these shell scripts if you want to extend them with more functionality.

## References

- https://www.fastify.io/docs/v2.2.x/Validation-and-Serialization/
- https://github.com/pact-foundation/pact-js/blob/master/examples/graphql/src/consumer.spec.ts
- https://docs.pact.io/getting_started/how_pact_works
- https://docs.pact.io/5-minute-getting-started-guide/
- https://github.com/pact-foundation/pact-js/tree/master/examples/e2e
- https://blog.dennisokeeffe.com/blog/2020-09-20-generating-types-with-quicktype/
- https://json-schema.org/understanding-json-schema/structuring.html
