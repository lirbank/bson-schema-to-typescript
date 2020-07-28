/* eslint-disable */
/* tslint:disable */
/**
 * This file was automatically generated by bson-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run bson-schema-to-typescript to regenerate this file.
 */

/**
 * User object
 */
export interface UserDoc {
  /**
   * String (min 8, max 8, alphanumeric pattern)
   */
  _id: string;
  /**
   * String
   */
  string?: string;
  /**
   * Number
   */
  number?: number;
  /**
   * Boolean
   */
  boolean?: boolean;
  /**
   * Null
   */
  null?: null;
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
}