import { parseConfig, expandEnv, defaultOptions } from "./options";

describe("Config object", () => {
  // Object
  test("empty object returns default options", () => {
    const config = JSON.stringify({});
    expect(parseConfig(config)).toStrictEqual(defaultOptions);
  });
});

describe("Invalid config (not an object)", () => {
  /**
   * JSON.stringify generated inputs
   */

  // Null
  test("null (JSON) throws", () => {
    const config = JSON.stringify(null);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // Undefined
  test("undefined (JSON) throws", () => {
    const config = JSON.stringify(undefined);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // Boolean
  test("boolean (JSON) throws", () => {
    const config = JSON.stringify(false);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("boolean (JSON) throws", () => {
    const config = JSON.stringify(true);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // Number
  test("number (JSON) throws", () => {
    const config = JSON.stringify(1);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("number (JSON) throws", () => {
    const config = JSON.stringify(0);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("number (JSON) throws", () => {
    const config = JSON.stringify(1.1);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // Array
  test("empty array (JSON) throws", () => {
    const config = JSON.stringify([]);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("array throws (JSON)", () => {
    const config = JSON.stringify(["1"]);
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // String
  test("empty string (JSON) throws", () => {
    const config = JSON.stringify("");
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("string (JSON) throws", () => {
    const config = JSON.stringify("x");
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  /**
   * Plain string inputs
   */

  test("empty string throws", () => {
    const config = "";
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("string throws", () => {
    const config = "x";
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("string throws", () => {
    const config = "undefined";
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });
});

describe("Modified options with wrong type", () => {
  // out
  test("out as number throws", () => {
    const config = JSON.stringify({ out: 1, enableConstEnums: 1 });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // bannerComment
  test("bannerComment as boolean throws", () => {
    const config = JSON.stringify({ bannerComment: true });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("bannerComment as array of non-strings throws", () => {
    const config = JSON.stringify({ bannerComment: [false] });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // enableConstEnums
  test("enableConstEnums as string throws", () => {
    const config = JSON.stringify({ enableConstEnums: "some string" });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // ignoreMinAndMaxItems
  test("ignoreMinAndMaxItems as object throws", () => {
    const config = JSON.stringify({ ignoreMinAndMaxItems: { x: 1 } });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // strictIndexSignatures
  test("strictIndexSignatures as null throws", () => {
    const config = JSON.stringify({ strictIndexSignatures: null });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  // unknownAny
  test("unknownAny as array throws", () => {
    const config = JSON.stringify({ unknownAny: ["1"] });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });
});

describe("Modified options with correct type", () => {
  // uri
  test("uri - string", () => {
    const config = JSON.stringify({ uri: "connection-string" });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      uri: "connection-string",
    });
  });

  test("uri - environment variable", () => {
    process.env.MONGO_URI = "connection-string";
    const config = JSON.stringify({ uri: "$MONGO_URI" });

    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      uri: "connection-string",
    });

    delete process.env.MONGO_URI;
  });

  // database
  test("database - string", () => {
    const config = JSON.stringify({ database: "db-string" });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      database: "db-string",
    });
  });

  test("database - environment variable", () => {
    process.env.MONGO_DB = "db-string";
    const config = JSON.stringify({ database: "$MONGO_DB" });

    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      database: "db-string",
    });

    delete process.env.MONGO_DB;
  });

  // out
  test("out", () => {
    const config = JSON.stringify({ out: "newPath/" });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      out: "newPath/",
    });
  });

  // bannerComment
  test("bannerComment", () => {
    const config = JSON.stringify({ bannerComment: ["some banner"] });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      bannerComment: ["some banner"],
    });
  });

  // enableConstEnums
  test("enableConstEnums", () => {
    const config = JSON.stringify({ enableConstEnums: false });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      enableConstEnums: false,
    });
  });

  // ignoreMinAndMaxItems
  test("ignoreMinAndMaxItems", () => {
    const config = JSON.stringify({ ignoreMinAndMaxItems: true });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      ignoreMinAndMaxItems: true,
    });
  });

  // strictIndexSignatures
  test("strictIndexSignatures", () => {
    const config = JSON.stringify({ strictIndexSignatures: true });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      strictIndexSignatures: true,
    });
  });

  // unknownAny
  test("unknownAny", () => {
    const config = JSON.stringify({ unknownAny: false });
    expect(parseConfig(config)).toStrictEqual({
      ...defaultOptions,
      unknownAny: false,
    });
  });
});

describe("Throw on excess and invalid options", () => {
  test("excess option throws", () => {
    const config = JSON.stringify({ excessOption: false });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("invalid option throws", () => {
    const config = JSON.stringify({ unknownAny: "should be boolean" });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("excess option and valid option throws", () => {
    const config = JSON.stringify({
      enableConstEnums: false,
      excessOption: false,
    });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("invalid option and valid option throws", () => {
    const config = JSON.stringify({
      enableConstEnums: false,
      unknownAny: "should be boolean",
    });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
  });

  test("excess option, invalid option, and valid option throws", () => {
    const config = JSON.stringify({
      enableConstEnums: false,
      excessOption: false,
      ignoreMinAndMaxItems: "xxx",
    });
    expect(() => parseConfig(config)).toThrow("Invalid configuration");
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
