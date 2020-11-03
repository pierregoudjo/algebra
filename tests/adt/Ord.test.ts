import {
  assert,
  bigInt,
  boolean,
  date,
  float,
  genericTuple,
  integer,
  property,
  record,
  string,
} from "https://cdn.skypack.dev/fast-check";

import { expect } from "https://deno.land/x/expect/mod.ts";
import { Eq, eqBoolean, eqDate, eqNumber, eqString } from "../../src/adt/Eq.ts";

import { Ord, ordBoolean, ordDate, ordNumber, ordString } from "../../src/adt/Ord.ts";

const totality = <T>(lte: Ord<T>, generator: (...args: unknown[]) => unknown) =>
  property(generator(), generator(), (x: T, y: T) => {
    expect(lte(x, y) || lte(y, x)).toBeTruthy();
  });

const antisymmetry = <T>(
  lte: Ord<T>,
  eq: Eq<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(generator(), generator(), (x: T, y: T) => {
    expect(lte(x, y) && lte(y, x) ? eq(x, y) : true).toBeTruthy();
  });

const transitivity = <T>(
  lte: Ord<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(generator(), generator(), generator(), (x: T, y: T, z: T) => {
    expect(lte(x, y) && lte(y, z) ? lte(x, z) : true).toBeTruthy();
  });

const ordLaws = <T>(lte: Ord<T>, eq: Eq<T>, generator: (...args: unknown[]) => unknown) => {
  assert(totality(lte, generator), undefined)
  assert(antisymmetry(lte, eq,generator), undefined)
  assert(transitivity(lte, generator), undefined)
}

Deno.test("ordString for string type", () => {
  ordLaws(ordString, eqString, string)
});

Deno.test("ordNumber for number type", () => {
  ordLaws(ordNumber, eqNumber, integer)
  ordLaws(ordNumber, eqNumber, bigInt)
  ordLaws(ordNumber, eqNumber, float)
});

Deno.test("ordBoolean for boolean type", () => {
  ordLaws(ordBoolean, eqBoolean, boolean)
});

Deno.test("ordDate for date type", () => {
  ordLaws(ordDate, eqDate, date)
});
