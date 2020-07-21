# bson-schema-to-typescript

Compile MongoDB JSON schema to TypeScript typings

## Installation

```sh
yarn add -D bson-schema-to-typescript
# or
npm install bson-schema-to-typescript --save-dev
```

## CLI usage

Create a `bson2ts.json` configuration file in the root of your project

```json
{
  "ignoreMinAndMaxItems": true
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
