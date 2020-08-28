import {
  compile as compileJSON,
  Options as CompileJSONOptions,
} from "json-schema-to-typescript";
import prettier from "prettier";
import { JsonObject, JsonValue } from "./types";
import { Options, defaultOptions } from "./options";

function format(text: string, options?: prettier.Options): string {
  return prettier.format(text, { ...options, parser: "typescript" });
}

/**
 * JSON Schema types ("type" keyword)
 * https://json-schema.org/understanding-json-schema/reference/type.html
 *
 * string
 * number
 * object
 * array
 * boolean
 * null
 *
 * BSON types ("bsonType" keyword)
 * https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#available-keywords
 * https://docs.mongodb.com/manual/reference/operator/query/type/#document-type-available-types
 *
 * [X] number
 * [ ] double
 * [X] string
 * [ ] object
 * [ ] array
 * [ ] binData
 * [ ] undefined  -- Deprecated
 * [ ] objectId
 * [X] bool
 * [X] date
 * [X] null
 * [ ] regex
 * [ ] dbPointer  -- Deprecated
 * [ ] javascript
 * [ ] symbol     -- Deprecated
 * [ ] javascriptWithScope
 * [X] int
 * [ ] timestamp
 * [ ] long
 * [X] decimal
 * [ ] minKey
 * [ ] maxKey
 *
 * BSON types -> TS
 */
const bsonToTs = new Map([
  ["number", "number"],
  ["string", "string"],
  ["bool", "boolean"],
  ["date", "Date"],
  ["null", "null"],
  ["int", "number"],
  ["decimal", "Decimal128"],
]);

/**
 * Generate the 'tsType' field for bson types.
 * https://github.com/bcherny/json-schema-to-typescript#custom-schema-properties
 */
function buildTsType(bsonType?: JsonValue): string | null {
  // Handle array of BSON types
  //
  // This is necessary since
  // https://github.com/bcherny/json-schema-to-typescript does not support
  // 'tsType' as an array
  if (Array.isArray(bsonType)) {
    return bsonType.map((e) => buildTsType(e)).join("|");
  }

  if (typeof bsonType !== "string") return null;

  // Return the 'tsType' based on the BSON type
  return bsonToTs.get(bsonType) || null;
}

/**
 * Recursively annotates the schema with "tsType" properties based on the
 * "bsonType" field
 */
function setTsType(schema: JsonValue): JsonValue {
  if (Array.isArray(schema)) {
    return schema.map(setTsType);
  }

  if (typeof schema === "object" && schema !== null) {
    const bsonType = "bsonType" in schema ? schema.bsonType : undefined;
    const isEnum = Reflect.has(schema, "enum");
    const tsType = buildTsType(bsonType);

    // Add 'tsType' fields to objects, except enums
    const v: JsonValue = !isEnum && tsType ? { ...schema, tsType } : schema;

    return Object.entries(v).reduce<JsonObject>((acc, [key, value]) => {
      return {
        ...acc,
        [key]: setTsType(value),
      };
    }, {});
  }

  return schema;
}

/**
 * Recursively checks if a schema relies on the Decimal128 BSON type anywhere
 */
function hasDecimal128(schema: JsonValue): boolean {
  if (schema === null || typeof schema !== "object") {
    return false;
  }

  if (Array.isArray(schema)) {
    return schema.some(hasDecimal128);
  }

  return Object.entries(schema).some(([key, value]) => {
    if (key === "bsonType") {
      if (value === "decimal") return true;
      if (Array.isArray(value)) return value.includes("decimal");
    }

    if (typeof value === "object") return hasDecimal128(value);

    return false;
  });
}

type compileOptions = Pick<
  Options,
  | "bannerComment"
  | "enableConstEnums"
  | "ignoreMinAndMaxItems"
  | "strictIndexSignatures"
  | "unknownAny"
> & { prettier: prettier.Options };

export async function compileBSON(
  schema: JsonObject,
  options?: Partial<compileOptions>
): Promise<string> {
  const baseBanner = options?.bannerComment || defaultOptions.bannerComment;

  // Import Decimal128 if the type annotations use it
  const bannerComment = (hasDecimal128(schema)
    ? [...baseBanner, `import { Decimal128 } from "mongodb";`]
    : baseBanner
  ).join("\n");

  const compileJSONOptions: Partial<CompileJSONOptions> = {
    bannerComment,
    enableConstEnums: options?.enableConstEnums,
    ignoreMinAndMaxItems: options?.ignoreMinAndMaxItems,
    strictIndexSignatures: options?.strictIndexSignatures,
    unknownAny: options?.unknownAny,
  };

  // Add "tsType" fields as needed
  const newSchema = setTsType(schema) as JsonObject;

  // Generate types
  const output = await compileJSON(newSchema, "", compileJSONOptions);

  return format(output, options?.prettier);
}
