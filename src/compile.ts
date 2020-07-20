import {
  compile as compileJSON,
  DEFAULT_OPTIONS,
} from "json-schema-to-typescript";

type JsonObject = { [key in string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

/**
 * Available JSON Schema types (type)
 * https://json-schema.org/understanding-json-schema/reference/type.html
 *
 * string
 * number
 * object
 * array
 * boolean
 * null
 *
 * Supported BSON types (bsonType)
 * https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#available-keywords
 * https://docs.mongodb.com/manual/reference/operator/query/type/#document-type-available-types
 *
 * double
 * string
 * object
 * array
 * binData
 * undefined -- Deprecated
 * objectId
 * bool
 * date
 * null
 * regex
 * dbPointer -- Deprecated
 * javascript
 * symbol -- Deprecated
 * javascriptWithScope
 * int
 * timestamp
 * long
 * decimal
 * minKey
 * maxKey
 */
const bsonTypeToTsType = new Map([
  // BSON -> TS
  ["string", "string"],
  ["date", "Date"],
  ["double", "Double"],
  ["number", "number"],
  ["decimal", "Decimal128"],
  ["bool", "boolean"],
]);

/**
 * Annotates the Schema objects with 'tsType' properties based on the 'bsonType'
 */
function addTsType(validator: JsonValue): JsonValue {
  if (Array.isArray(validator)) {
    return validator.map(addTsType);
  }

  if (typeof validator === "object" && validator !== null) {
    const bsonType = "bsonType" in validator ? validator.bsonType : undefined;

    const tsType =
      typeof bsonType === "string" ? bsonTypeToTsType.get(bsonType) : undefined;

    const isEnum = Reflect.has(validator, "enum");

    // Add 'tsType' fields to objects, except enums
    const v: JsonValue =
      !isEnum && typeof bsonType === "string" && typeof tsType === "string"
        ? { ...validator, tsType }
        : validator;

    return Object.entries(v).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: addTsType(value),
      };
    }, {});
  }

  return validator;
}

function hasDecimal128(validator: JsonValue): boolean {
  if (validator === null) return false;

  if (Array.isArray(validator)) {
    return validator.some((e) => hasDecimal128(e));
  }

  return Object.entries(validator).some(([key, value]) => {
    if (typeof validator === "object") {
      return key === "tsType" && value === "Decimal128";
    }

    return hasDecimal128(value);
  });
}

export async function compileBSON(
  schema: JsonObject,
  options: Parameters<typeof compileJSON>[2]
) {
  // Add 'tsType' fields as needed
  const newSchema = addTsType(schema) as JsonObject;

  // Import Decimal128 if the type annotations use it
  const typeImports = hasDecimal128(newSchema)
    ? "\n\nimport { Decimal128 } from 'bson';\n"
    : "";

  const bannerComment = [
    "/* eslint-disable */",
    DEFAULT_OPTIONS.bannerComment,
    typeImports,
  ].join("\n");

  // Generate types
  const output = await compileJSON(newSchema, "", {
    ...options,
    bannerComment,
  });

  return output;
}
