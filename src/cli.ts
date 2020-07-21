#!/usr/bin/env node --require dotenv/config

import fs from "fs";
import { getAllServerSchemas } from "./mongodb";
import { compileBSON } from "./compile";

const configPath = "./bson2ts.json";
const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error(`${configPath} configuration file does not exist`);
  }

  const config = fs.readFileSync(configPath).toString();

  return JSON.parse(config) as {
    bannerComment: string[];
  };
}

async function run() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable not defined");
  }

  if (!MONGODB_DB_NAME) {
    throw new Error("MONGODB_DB_NAME environment variable not defined");
  }

  // Load configuration
  const opts = loadConfig();

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

      // Store types
      fs.writeFileSync(`./src/__generated__/${filename}.ts`, output);
    })
  );
}

run().catch((error) => console.error(error));
