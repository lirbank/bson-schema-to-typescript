# bson-schema-to-typescript

Compile MongoDB JSON Schema to TypeScript typings

## Installation

```sh
yarn add -D bson-schema-to-typescript
# or
npm install bson-schema-to-typescript --save-dev
```

## Configuration

Create a `bson2ts.json` configuration file in the root of your project

```json
{
  "ignoreMinAndMaxItems": true
}
```

Create a `.env` file in the root of your project, with the following environment
variables, so `bson-schema-to-typescript` know how to connect to your MongoDB
server.

```
MONGODB_URI='mongodb://localhost:27017'
MONGODB_DB_NAME='some-db'
```

## CLI usage

Generate typings for each MongoDB collection

```sh
npx bson-schema-to-typescript
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
