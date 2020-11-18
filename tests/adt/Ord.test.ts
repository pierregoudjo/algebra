import {
  assert,
  bigInt,
  boolean,
  date,
  float,
  genericTuple,
  integer,
  property,
  string,
} from "https://cdn.skypack.dev/fast-check";

import { expect } from "https://deno.land/x/expect/mod.ts";
import {
  eqBoolean,
  eqDate,
  eqNumber,
  eqString,
  getTupleEq,
  Setoid,
} from "../../src/adt/Setoid.ts";

import {
  between,
  contramap,
  getTupleOrd,
  gt,
  gte,
  lt,
  lte,
  max,
  min,
  Ord,
  ordBoolean,
  ordDate,
  ordNumber,
  ordString,
} from "../../src/adt/Ord.ts";

const totality = <T>(lte: Ord<T>, generator: (...args: unknown[]) => unknown) =>
  property(generator(), generator(), (x: T, y: T) => {
    expect(lte(x, y) || lte(y, x)).toBeTruthy();
  });

const antisymmetry = <T>(
  lte: Ord<T>,
  eq: Setoid<T>,
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

const associativity = <T>(
  f: (x: T, y: T) => T,
  eq: Setoid<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(
    generator(),
    generator(),
    generator(),
    (x: T, y: T, z: T) => {
      expect(
        eq(
          f(f(x, y), z),
          f(x, f(y, z)),
        ),
      ).toBeTruthy();
    },
  );

const ordLaws = <T>(
  lte: Ord<T>,
  eq: Setoid<T>,
  generator: (...args: unknown[]) => unknown,
) => {
  assert(totality(lte, generator), undefined);
  assert(antisymmetry(lte, eq, generator), undefined);
  assert(transitivity(lte, generator), undefined);
};

Deno.test("ordString for string type", () => {
  ordLaws(ordString, eqString, string);
});

Deno.test("ordNumber for number type", () => {
  ordLaws(ordNumber, eqNumber, integer);
  ordLaws(ordNumber, eqNumber, bigInt);
  ordLaws(ordNumber, eqNumber, float);
});

Deno.test("ordBoolean for boolean type", () => {
  ordLaws(ordBoolean, eqBoolean, boolean);
});

Deno.test("ordDate for date type", () => {
  ordLaws(ordDate, eqDate, date);
});

Deno.test("Min is associative", () => {
  const minNumber = min(ordNumber);
  const minString = min(ordString);
  const minBoolean = min(ordBoolean);
  const minDate = min(ordDate);

  assert(associativity(minNumber, eqNumber, integer), undefined);
  assert(associativity(minString, eqString, string), undefined);
  assert(associativity(minBoolean, eqBoolean, boolean), undefined);
  assert(associativity(minDate, eqDate, date), undefined);
});

Deno.test("Max is associative", () => {
  const maxNumber = max(ordNumber);
  const maxString = max(ordString);
  const maxBoolean = max(ordBoolean);
  const maxDate = max(ordDate);

  assert(associativity(maxNumber, eqNumber, integer), undefined);
  assert(associativity(maxString, eqString, string), undefined);
  assert(associativity(maxBoolean, eqBoolean, boolean), undefined);
  assert(associativity(maxDate, eqDate, date), undefined);
});

Deno.test("Between", () => {
  const betweenNumber = between(ordNumber);
  const betweenProperty = property(
    integer(),
    integer(),
    integer(),
    (x: number, y: number, z: number) => {
      expect(betweenNumber(x, z)(y)).toEqual((x <= y) && (y <= z));
    },
  );

  assert(betweenProperty, undefined);
});

Deno.test("Contramap", () => {
  type BoxedNumber = { value: number };
  const unboxValue = (x: BoxedNumber): number => x.value;

  const ord = contramap(unboxValue)(ordNumber);

  assert(
    property(
      integer(),
      integer(),
      (x: number, y: number) =>
        expect(ordNumber(x, y)).toEqual(ord({ value: x }, { value: y })),
    ),
    undefined,
  );
});

Deno.test("getTupleOrd", () => {
  const ordTriple = getTupleOrd(
    [ordString, ordString, ordString] as const,
  );
  const eqTriple = getTupleEq(
    [eqString, eqString, eqString] as const,
  );
  const generator = () => genericTuple([string(), string(), string()]);

  ordLaws(ordTriple, eqTriple, generator);

  expect(ordTriple(["a", "b", "c"], ["a", "b", "c"])).toBeTruthy();
  expect(ordTriple(["a", "a", "b"], ["a", "a", "c"])).toBeTruthy();
  expect(ordTriple(["", "!", ""], ["", "", " "])).toBeFalsy();
  expect(ordTriple(["", "", " "], ["", "!", ""])).toBeTruthy();
  expect(ordTriple(["a", "b", "c"], ["a", "a", "c"])).toBeFalsy();
  expect(ordTriple(["a", "b", "c"], ["a", "b", "a"])).toBeFalsy();
});

Deno.test("lt, gt, lte and gte", () => {
  const ordTriple = getTupleOrd(
    [ordString, ordString, ordString] as const,
  );
  const ltTriple = lt(ordTriple);
  expect(ltTriple(["a", "b", "b"], ["a", "b", "c"])).toBeTruthy();
  expect(ltTriple(["a", "b", "c"], ["a", "b", "c"])).toBeFalsy();
  expect(ltTriple(["a", "b", "d"], ["a", "b", "c"])).toBeFalsy();

  const lteTriple = lte(ordTriple);
  expect(lteTriple(["a", "b", "a"], ["a", "b", "c"])).toBeTruthy();
  expect(lteTriple(["a", "b", "c"], ["a", "b", "c"])).toBeTruthy();
  expect(lteTriple(["a", "b", "d"], ["a", "b", "c"])).toBeFalsy();

  const gtTriple = gt(ordTriple);
  expect(gtTriple(["a", "b", "c"], ["a", "a", "c"])).toBeTruthy();
  expect(gtTriple(["a", "b", "a"], ["a", "b", "c"])).toBeFalsy();
  expect(gtTriple(["a", "a", "c"], ["a", "a", "c"])).toBeFalsy();

  const gteString = gte(ordTriple);
  expect(gteString(["a", "b", "c"], ["a", "a", "c"])).toBeTruthy();
  expect(gteString(["a", "a", "c"], ["a", "a", "c"])).toBeTruthy();
  expect(gteString(["a", "b", "a"], ["a", "b", "c"])).toBeFalsy();
});
