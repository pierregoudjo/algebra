import {
  array,
  assert,
  integer,
  property,
  string,
} from "https://cdn.skypack.dev/fast-check";

import { expect } from "https://deno.land/x/expect/mod.ts";
import {
  concatArray,
  concatNumber,
  concatString,
  Semigroup,
} from "../../src/adt/Semigroup.ts";

const associativity = <T>(
  concat: Semigroup<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(
    generator(),
    generator(),
    generator(),
    (x: T, y: T, z: T) =>
      // expect(equals(concat(x, concat(y, z)), concat(concat(x, y), z))).toBeTruthy()
      expect(concat(x, concat(y, z))).toEqual(concat(concat(x, y), z)),
  );

Deno.test("concatString is associative", () => {
  assert(associativity(concatString, string), undefined);
});

Deno.test("concatNumber is associative", () => {
  assert(associativity(concatNumber, integer), undefined);
});

Deno.test("concatArray is associative", () => {
  const generator = () => array(string());
  assert(associativity(concatArray, generator), undefined);
});
