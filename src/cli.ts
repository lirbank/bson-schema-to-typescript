#!/usr/bin/env node --require dotenv/config

import fs from "fs";
import path from "path";
import { getDatabaseSchemas } from "./mongodb";
import { compileBSON } from "./compile";
import { loadConfig, prettierOptions } from "./options";

async function main(): Promise<void> {
  // Load configuration file
  const opts = loadConfig();

  // Get schemas for all collections from the MongoDB server
  const schemas = await getDatabaseSchemas(opts.uri, opts.database);

  console.log("Generating typescript types for MongoDB collection schemas");

  await Promise.all(
    schemas.map(async ({ schema, collectionName }) => {
      console.log((!schema ? "-" : "OK").padEnd(4), collectionName);

      // Do nothing when a collection has no schema
      if (!schema) return;

      const filename = typeof schema.title === "string" ? schema.title : null;
      if (!filename) throw new Error("A schema title is required");

      if (!fs.existsSync(opts.out)) {
        fs.mkdirSync(opts.out, { recursive: true });
      }

      const destination = path.join(opts.out, filename) + ".ts";

      const output = await compileBSON(schema, {
        ...opts,
        prettier: await prettierOptions(destination),
      });

      fs.writeFileSync(destination, output);
    })
  );
}

main().catch(console.error);
