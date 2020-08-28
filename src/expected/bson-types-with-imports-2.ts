/* eslint-disable */
/* tslint:disable */

/**
 * This file was automatically generated by bson-schema-to-typescript.
 * https://www.npmjs.com/package/bson-schema-to-typescript
 *
 * Do not modify it by hand. Instead, modify the MongoDB $jsonSchema validator,
 * and run bson2ts to regenerate this file.
 */
import { Decimal128 } from "mongodb";

/**
 * User object
 */
export interface UserDoc {
  /**
   * Multiple types: string
   */
  multipleTypes1?: string;
  /**
   * Multiple types: string, number
   */
  multipleTypes2?: string | number;
  /**
   * Multiple types: string, number, boolean
   */
  multipleTypes3?: string | number | boolean;
  /**
   * Multiple types: string, number, boolean, null
   */
  multipleTypes4?: string | number | boolean | null;
  /**
   * Multiple types: string, number, boolean, null, date
   */
  multipleTypes5?: string | number | boolean | null | Date;
  /**
   * Multiple types: string, number, boolean, null, date, decimal
   */
  multipleTypes6?: string | number | boolean | null | Date | Decimal128;
}
