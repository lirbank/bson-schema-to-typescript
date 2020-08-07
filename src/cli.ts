#!/usr/bin/env node --require dotenv/config

import fs from "fs";
import path from "path";
import { getAllServerSchemas } from "./mongodb";
import { compileBSON } from "./compile";
import { loadConfig } from "./options";

const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable not defined");
  }

  if (!MONGODB_DB_NAME) {
    throw new Error("MONGODB_DB_NAME environment variable not defined");
  }

  // Load configuration
  const opts = loadConfig();

  console.log(JSON.stringify(opts, null, 2));

  // Get schemas for all collections from the MongoDB server
  const schemas = await getAllServerSchemas(MONGODB_URI, MONGODB_DB_NAME);

  console.log("Generating typescript types for MongoDB collection schemas");

  await Promise.all(
    schemas.map(async ({ schema, collectionName }) => {
      console.log((!schema ? "-" : "OK").padEnd(4), collectionName);

      // Do nothing when a collection has no schema
      if (!schema) return;

      const output = await compileBSON(schema, opts);

      const filename = typeof schema.title === "string" ? schema.title : "";

      if (!filename) throw new Error("A schema title is required");

      if (!fs.existsSync(opts.path)) {
        fs.mkdirSync(opts.path, { recursive: true });
      }

      const p = path.join(opts.path, filename) + ".ts";

      fs.writeFileSync(p, output);
    })
  );
}

main().catch((error) => console.error(error));
