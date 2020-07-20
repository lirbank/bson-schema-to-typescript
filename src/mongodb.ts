import { Collection, MongoClient } from "mongodb";
import { JsonObject } from "./types";

interface CollectionOptions {
  validator?: { $jsonSchema?: JsonObject };
  validationLevel?: string;
  validationAction?: string;
}

/**
 * Retrieves the stored JSON Schema from a MongoDB collection
 */
export async function getSchema(col: Collection) {
  const options: CollectionOptions = (await col.options()) as CollectionOptions;

  return options.validator?.$jsonSchema;
}

/**
 * ...
 */
export async function getSchemas(
  url: string,
  dbName: string,
  collectionNames: string[]
) {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbName);

  const r = await Promise.all(
    collectionNames.map(async (colName) => {
      return {
        name: colName,
        schema: await getSchema(db.collection(colName)),
      };
    })
  );

  await client.close();

  return r;
}
