import { Collection, MongoClient, Db } from "mongodb";
import { JsonObject } from "./types";

export async function mongodb(
  serverUri: string,
  dbName: string
): Promise<{
  client: MongoClient;
  db: Db;
}> {
  const client = new MongoClient(serverUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbName);

  return { client, db };
}

interface CollectionOptions {
  validator?: { $jsonSchema?: JsonObject };
  validationLevel?: string;
  validationAction?: string;
}

/**
 * Retrieves the stored JSON Schema from a MongoDB collection
 */
export async function getCollectionSchema(
  col: Collection
): Promise<JsonObject | undefined> {
  const options: CollectionOptions = (await col.options()) as CollectionOptions;

  return options.validator?.$jsonSchema;
}

/**
 * Retrieves a list of JSON Schemas for each collection of the MongoDB server
 */
export async function getDatabaseSchemas(
  serverUri: string,
  dbName: string
): Promise<
  {
    collectionName: string;
    schema: JsonObject | undefined;
  }[]
> {
  const { client, db } = await mongodb(serverUri, dbName);

  const allCols = await db.collections();

  const r = await Promise.all(
    allCols.map(async (col) => {
      return {
        collectionName: col.collectionName,
        schema: await getCollectionSchema(col),
      };
    })
  );

  await client.close();

  return r;
}
