import fs from "fs";
import { compileBSON } from "./compile";

function getExpected(filename: string): string {
  return fs.readFileSync("./src/expected/" + filename + ".ts").toString();
}

describe("compileBSON", () => {
  test(`JSON types`, async () => {
    const schema = {
      title: "UserDoc",
      description: "User object",
      bsonType: "object",
      additionalProperties: false,
      required: ["_id"],
      properties: {
        _id: {
          type: "string",
          minLength: 8,
          maxLength: 8,
          description: "String (min 8, max 8, alphanumeric pattern)",
          pattern: "^[a-zA-Z0-9]*$",
        },
        string: {
          description: "String",
          type: "string",
        },
        number: {
          description: "Number",
          type: "number",
        },
        boolean: {
          description: "Boolean",
          type: "boolean",
        },
        null: {
          description: "Null",
          type: "null",
        },
        multipleTypes1: {
          description: "Multiple types: string",
          type: ["string"],
        },
        multipleTypes2: {
          description: "Multiple types: string, number",
          type: ["string", "number"],
        },
        multipleTypes3: {
          description: "Multiple types: string, number, boolean",
          type: ["string", "number", "boolean"],
        },
        multipleTypes4: {
          description: "Multiple types: string, number, boolean, null",
          type: ["string", "number", "boolean", "null"],
        },
      },
    };

    expect(await compileBSON(schema)).toBe(getExpected("json-types"));
  });

  test(`BSON types`, async () => {
    const schema = {
      title: "UserDoc",
      description: "User object",
      bsonType: "object",
      additionalProperties: false,
      required: ["_id"],
      properties: {
        _id: {
          bsonType: "string",
          minLength: 8,
          maxLength: 8,
          description: "String (min 8, max 8, alphanumeric pattern)",
          pattern: "^[a-zA-Z0-9]*$",
        },
        string: {
          description: "String",
          bsonType: "string",
        },
        number: {
          description: "Number",
          bsonType: "number",
        },
        boolean: {
          description: "Boolean",
          bsonType: "bool",
        },
        null: {
          description: "Null",
          bsonType: "null",
        },
        date: {
          description: "Date",
          bsonType: "date",
        },
        multipleTypes1: {
          description: "Multiple types: string",
          bsonType: ["string"],
        },
        multipleTypes2: {
          description: "Multiple types: string, number",
          bsonType: ["string", "number"],
        },
        multipleTypes3: {
          description: "Multiple types: string, number, boolean",
          bsonType: ["string", "number", "bool"],
        },
        multipleTypes4: {
          description: "Multiple types: string, number, boolean, null",
          bsonType: ["string", "number", "bool", "null"],
        },
        multipleTypes5: {
          description: "Multiple types: string, number, boolean, null, date",
          bsonType: ["string", "number", "bool", "null", "date"],
        },
      },
    };

    expect(await compileBSON(schema)).toBe(getExpected("bson-types"));
  });

  test(`BSON types with imports - 1`, async () => {
    const schema = {
      title: "UserDoc",
      description: "User object",
      bsonType: "object",
      additionalProperties: false,
      required: [],
      properties: {
        string: {
          description: "String",
          bsonType: "string",
        },
        number: {
          description: "Number",
          bsonType: "number",
        },
        boolean: {
          description: "Boolean",
          bsonType: "bool",
        },
        null: {
          description: "Null",
          bsonType: "null",
        },
        date: {
          description: "Date",
          bsonType: "date",
        },
        decimal: {
          description: "Decimal",
          bsonType: "decimal",
        },
      },
    };

    expect(await compileBSON(schema)).toBe(
      getExpected("bson-types-with-imports-1")
    );
  });

  test(`BSON types with imports - 2`, async () => {
    const schema = {
      title: "UserDoc",
      description: "User object",
      bsonType: "object",
      additionalProperties: false,
      required: [],
      properties: {
        multipleTypes1: {
          description: "Multiple types: string",
          type: ["string"],
        },
        multipleTypes2: {
          description: "Multiple types: string, number",
          type: ["string", "number"],
        },
        multipleTypes3: {
          description: "Multiple types: string, number, boolean",
          type: ["string", "number", "boolean"],
        },
        multipleTypes4: {
          description: "Multiple types: string, number, boolean, null",
          type: ["string", "number", "boolean", "null"],
        },
        multipleTypes5: {
          description: "Multiple types: string, number, boolean, null, date",
          bsonType: ["string", "number", "bool", "null", "date"],
        },
        multipleTypes6: {
          description:
            "Multiple types: string, number, boolean, null, date, decimal",
          bsonType: ["string", "number", "bool", "null", "date", "decimal"],
        },
      },
    };

    expect(await compileBSON(schema)).toBe(
      getExpected("bson-types-with-imports-2")
    );
  });
});
