import { parseConfig, expandEnv, defaultOptions } from "./options";

describe("Default options", () => {
  /**
   * JSON.stringify generated inputs
   */

  // Null
  test("null returns default options", () => {
    const config = JSON.stringify(null);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // Undefined
  test("undefined returns default options", () => {
    const config = JSON.stringify(undefined);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // Boolean
  test("boolean returns default options", () => {
    const config = JSON.stringify(false);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("boolean returns default options", () => {
    const config = JSON.stringify(true);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // Number
  test("number returns default options (JSON)", () => {
    const config = JSON.stringify(1);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("number returns default options (JSON)", () => {
    const config = JSON.stringify(0);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("number returns default options (JSON)", () => {
    const config = JSON.stringify(1.1);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // Object
  test("empty object returns default options", () => {
    const config = JSON.stringify({});
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // Array
  test("empty array returns default options", () => {
    const config = JSON.stringify([]);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("array returns default options", () => {
    const config = JSON.stringify(["1"]);
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // String
  test("empty string returns default options", () => {
    const config = JSON.stringify("");
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("some string returns default options", () => {
    const config = JSON.stringify("x");
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  /**
   * Plain string inputs
   */
  test("empty string returns default options", () => {
    const config = "";
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("some string returns default options", () => {
    const config = "x";
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("some string returns default options", () => {
    const config = "undefined";
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });
});

describe("Modified options with wrong type", () => {
  // bannerComment
  test("bannerComment as boolean returns default options", () => {
    const config = JSON.stringify({ bannerComment: true });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("bannerComment as array of non-strings returns default options", () => {
    const config = JSON.stringify({ bannerComment: [false] });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // enableConstEnums
  test("enableConstEnums as string returns default options", () => {
    const config = JSON.stringify({ enableConstEnums: "some string" });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // ignoreMinAndMaxItems
  test("ignoreMinAndMaxItems as object returns default options", () => {
    const config = JSON.stringify({ ignoreMinAndMaxItems: { x: 1 } });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // strictIndexSignatures
  test("strictIndexSignatures as null returns default options", () => {
    const config = JSON.stringify({ strictIndexSignatures: null });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // unknownAny
  test("unknownAny as array returns default options", () => {
    const config = JSON.stringify({ unknownAny: ["1"] });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  // path
  test("path as number returns default options", () => {
    const config = JSON.stringify({ path: 1 });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });
});

describe("Modified options", () => {
  test("bannerComment", () => {
    const config = JSON.stringify({ bannerComment: ["some banner"] });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      bannerComment: ["some banner"],
    });
  });

  test("enableConstEnums", () => {
    const config = JSON.stringify({ enableConstEnums: false });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      enableConstEnums: false,
    });
  });

  test("ignoreMinAndMaxItems", () => {
    const config = JSON.stringify({ ignoreMinAndMaxItems: true });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      ignoreMinAndMaxItems: true,
    });
  });

  test("strictIndexSignatures", () => {
    const config = JSON.stringify({ strictIndexSignatures: true });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      strictIndexSignatures: true,
    });
  });

  test("unknownAny", () => {
    const config = JSON.stringify({ unknownAny: false });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      unknownAny: false,
    });
  });

  test("path", () => {
    const config = JSON.stringify({ path: "newPath/" });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      path: "newPath/",
    });
  });

  test("mongodbUri - string", () => {
    const config = JSON.stringify({ mongodbUri: "connection-string" });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      mongodbUri: "connection-string",
    });
  });

  test("mongodbUri - environment variable", () => {
    process.env.MONGO_URI = "connection-string";
    const config = JSON.stringify({ mongodbDatabase: "$MONGO_URI" });

    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      mongodbDatabase: "connection-string",
    });

    delete process.env.MONGO_URI;
  });

  test("mongodbDatabase - string", () => {
    const config = JSON.stringify({ mongodbDatabase: "db-string" });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      mongodbDatabase: "db-string",
    });
  });

  test("mongodbDatabase - environment variable", () => {
    process.env.MONGO_DB = "db-string";
    const config = JSON.stringify({ mongodbDatabase: "$MONGO_DB" });

    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      mongodbDatabase: "db-string",
    });

    delete process.env.MONGO_DB;
  });
});

describe("Omit excess and invalid options", () => {
  test("excess option is skipped", () => {
    const config = JSON.stringify({ excessOption: false });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("invalid option is skipped", () => {
    const config = JSON.stringify({ unknownAny: "should be boolean" });
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });

  test("excess option is skipped and valid option is in effect", () => {
    const config = JSON.stringify({
      enableConstEnums: false,
      excessOption: false,
    });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      enableConstEnums: false,
    });
  });

  test("invalid option is skipped and valid option is in effect", () => {
    const config = JSON.stringify({
      enableConstEnums: false,
      unknownAny: "should be boolean",
    });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      enableConstEnums: false,
    });
  });

  test("excess option is skipped, invalid option is skipped, and valid option is in effect", () => {
    const config = JSON.stringify({
      enableConstEnums: false,
      excessOption: false,
      ignoreMinAndMaxItems: "xxx",
    });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      enableConstEnums: false,
    });
  });
});

describe("expandEnvironment", () => {
  test("String: SOME_VALUE", () => {
    expect(expandEnv("SOME_VALUE")).toBe("SOME_VALUE");
  });

  test("Env:    $SOME_DEFINED_VAR", () => {
    process.env.SOME_DEFINED_VAR = "SOME_VALUE";
    expect(expandEnv("$SOME_DEFINED_VAR")).toBe("SOME_VALUE");
    delete process.env.SOME_DEFINED_VAR;
  });

  test("Env:    $SOME_UNDEFINED_VAR", () => {
    expect(() => {
      expandEnv("$SOME_UNDEFINED_VAR");
    }).toThrow();
  });
});
