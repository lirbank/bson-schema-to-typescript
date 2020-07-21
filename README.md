# bson-schema-to-typescript

Compile MongoDB JSON Schema to TypeScript typings

## Installation

```sh
# Yarn:
yarn add -D bson-schema-to-typescript

# NPM:
npm install bson-schema-to-typescript --save-dev
```

## Configuration

Create a `.env` file in the root of your project, with the following environment
variables, so `bson-schema-to-typescript` know how to connect to your MongoDB
server.

```
MONGODB_URI='mongodb://localhost:27017'
MONGODB_DB_NAME='some-db'
```

Create a `bson2ts.json` configuration file in the root of your project

```json
{
  "ignoreMinAndMaxItems": true
}
```

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
```

## Programmatic usage

```ts
import {
  compileBSON,
  DEFAULT_OPTIONS,
  getCollectionSchema,
  getAllServerSchemas,
} from "bson-schema-to-typescript";
```
