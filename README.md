# bson-schema-to-typescript

Compile MongoDB JSON Schema to TypeScript typings. This package connects to your
MongoDB server, retrieves any stored JSON Schema validators, and compiles them
into TypeScript typings.

For more information about MongoDB schema validation, see:

[MongoDB Schema
Validation](https://docs.mongodb.com/manual/core/schema-validation/#json-schema)
and [MongoDB \$jsonSchema
operator](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/)

## Features

Written in TypeScript and includes type definitions.

- Can be used as CLI or programmatically
- Works with vanilla JavaScript and
  [TypeScript](https://www.typescriptlang.org/)
- Adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- CLI output is formatted with [Prettier](https://prettier.io/), adhering to
  project [format options](https://prettier.io/docs/en/configuration.html)

## Installation

```sh
# Yarn:
yarn add -D bson-schema-to-typescript

# NPM:
npm install bson-schema-to-typescript --save-dev
```

## Configuration

Create a `bson2ts.json` configuration file in the root of your project to modify
the configuration defaults. It is optional to provide a configuration file.

The default configuration is:

```json
{
  "mongodbUri": "mongodb://localhost:27017",
  "mongodbDatabase": "",
  "path": "src/__generated__",
  "bannerComment": [
    "/* eslint-disable */",
    "/* tslint:disable */",
    "",
    "/**",
    "* This file was automatically generated by bson-schema-to-typescript.",
    "* https://www.npmjs.com/package/bson-schema-to-typescript",
    "*",
    "* Do not modify it by hand. Instead, modify the MongoDB $jsonSchema validator,",
    "* and run bson2ts to regenerate this file.",
    "*/"
  ],
  "enableConstEnums": true,
  "ignoreMinAndMaxItems": false,
  "strictIndexSignatures": false,
  "unknownAny": true
}
```

## Connecting to MongoDB

The `bson2ts` CLI connects to the MongoDB server using the connection string
provided by the `mongodbUri` configuration option, and the database name
provided by the `mongodbDatabase` configuration option.

## Environment variables

If the `mongodbUri` or `mongodbDatabase` configuration options start with a `$`
(dollar sign), they are treated as environment variables and will be expanded.

For example, consider this configuration:

```json
{
  "mongodbUri": "mongodb://localhost:27017",
  "mongodbDatabase": "$MONGODB_DATABASE"
}
```

In this case `mongodbUri` will be used as-is (eg. `mongodb://localhost:27017`)
but `mongodbDatabase` will be use the `MONGODB_DATABASE` environment variable of
your system (eg. what ever `process.env.MONGODB_DATABASE` is set to).

In this case, `mongodbUri` will be used as-is (e.g.
`mongodb://localhost:27017`), but `mongodbDatabase` will use the
`MONGODB_DATABASE` environment variable of your system (e.g. whatever
`process.env.MONGODB_DATABASE` is set to).

## CLI usage

Generate typings for each MongoDB collection.

Using `npx`:

```sh
npx bson-schema-to-typescript
```

Or add a script to `package.json`:

```json
{
  "scripts": {
    "generate-types": "bson2ts"
  }
}

Then run `yarn generate-types` or `npm run generate-types`
```

## Usage of generated typings

Once you have generated the types, you can implement them like this:

```ts
import { Db } from "mongodb";
import { UserDoc } from "./__generated__/UserDoc";
import { PostDoc } from "./__generated__/PostDoc";

export function collections(db: Db) {
  return {
    users: db.collection<UserDoc>("users"),
    posts: db.collection<PostDoc>("posts"),
  };
}
```

## Programmatic usage

```ts
import {
  compileBSON,
  getCollectionSchema,
  getAllServerSchemas,
} from "bson-schema-to-typescript";
```

## Maintainers

- [@lirbank](https://github.com/lirbank)
