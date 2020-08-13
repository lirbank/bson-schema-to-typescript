#!/usr/bin/env node --require dotenv/config

import fs from "fs";
import path from "path";
import { getAllServerSchemas } from "./mongodb";
import { compileBSON } from "./compile";
import { loadConfig } from "./options";
import prettier from "prettier";

function getEnv(name: string): string {
  const env = process.env[name];

  if (!env) {
    throw new Error(`${name} environment variable not defined`);
  }

  return env;
}

async function format(path: string, text: string): Promise<string> {
  const options = await prettier.resolveConfig(path);

  return prettier.format(text, {
    ...options,
    parser: "typescript",
  });
}

async function main(): Promise<void> {
  // Load configuration
  const opts = loadConfig();

  // Get schemas for all collections from the MongoDB server
  const schemas = await getAllServerSchemas(
    getEnv(opts.env.MONGODB_URI),
    getEnv(opts.env.MONGODB_DATABASE)
  );

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

      const destination = path.join(opts.path, filename) + ".ts";
      const formatted = await format(destination, output);

      fs.writeFileSync(destination, formatted);
    })
  );
}

main().catch(console.error);
