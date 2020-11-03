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
import {
  Eq,
  eqBoolean,
  eqDate,
  eqNumber,
  eqString,
  fromEquals,
  getStructEq,
  getTupleEq,
} from "../../src/adt/Eq.ts";

const reflexivity = <T>(e: Eq<T>, generator: (...args: unknown[]) => unknown) =>
  property(generator(), (x: T) => {
    expect(e(x, x)).toBeTruthy();
  });

const symmetry = <T>(e: Eq<T>, generator: (...args: unknown[]) => unknown) =>
  property(generator(), generator(), (x: T, y: T) => {
    expect(e(x, y)).toEqual(e(y, x));
  });

const transitivity = <T>(
  e: Eq<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(
    generator(),
    generator(),
    generator(),
    (x: T, y: T, z: T) =>
      expect(e(x, y) && e(y, z) ? e(x, z) : true).toBeTruthy(),
  );

const eqLaws = <T>(e: Eq<T>, generator: (...args: unknown[]) => unknown) => {
  assert(reflexivity(e, generator), undefined);
  assert(symmetry(e, generator), undefined);
  assert(transitivity(e, generator), undefined);
};

Deno.test("fromEquals check for reference equality first", () => {
  const equals = () => false;

  const eq = fromEquals(equals);

  assert(
    property(string(), (str: string) => expect(eq(str, str)).toBeTruthy()),
    undefined,
  );
});

Deno.test("EqString for string type", () => {
  eqLaws(eqString, string);
});

Deno.test("EqNumber for number type", () => {
  eqLaws(eqNumber, integer);
  eqLaws(eqNumber, float);
  eqLaws(eqNumber, bigInt);
});

Deno.test("eqBoolean for string type", () => {
  eqLaws(eqBoolean, boolean);
});

Deno.test("date type", () => {
  eqLaws(eqDate, date);
});

Deno.test("getTupleEq combinator", () => {
  const eqTriple = getTupleEq(
    eqString,
    eqString,
    eqString,
  );

  const triple = () => genericTuple([string(), string(), string()]);

  eqLaws(eqTriple, triple);
});

Deno.test("getStructEq combinator", () => {
  const eqPoint = getStructEq({
    x: eqNumber,
    y: eqNumber,
  });

  const point = () => record({ x: integer(), y: integer() }, undefined);

  eqLaws(eqPoint, point);
});
