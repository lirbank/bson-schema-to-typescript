import fs from "fs";
import { compileBSON } from "./compile";

describe("compileBSON", () => {
  const expected = fs.readFileSync("./src/expected/user-schema.ts").toString();

  const schema = {
    title: "UserDoc",
    description: "User object",
    bsonType: "object",
    additionalProperties: false,
    required: ["_id", "createdAt", "modifiedAt"],
    properties: {
      _id: {
        bsonType: "string",
        minLength: 8,
        maxLength: 8,
        description: "String (min 8, max 8, alphanumeric pattern)",
        pattern: "^[a-zA-Z0-9]*$",
      },
      createdAt: {
        description: "Date",
        bsonType: "date",
      },
      modifiedAt: {
        description: "Date",
        bsonType: "date",
      },
    },
  };

  test(`compileBSON with oneOf`, async () => {
    expect(await compileBSON(schema)).toBe(expected);
  });
});
