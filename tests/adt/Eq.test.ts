import {
  array,
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
  contramap,
  Eq,
  eqArray,
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
  // eq will always returns false if the variables don't share the same reference
  const equals = () => false;
  const eq = fromEquals(equals);

  assert(
    property(string(), (str: string) => expect(eq(str, str)).toBeTruthy()),
    undefined,
  );
});

Deno.test("EqString for string type obeys Setoid Laws", () => {
  eqLaws(eqString, string);
});

Deno.test("EqNumber for number type obeys Setoid Laws", () => {
  eqLaws(eqNumber, integer);
  eqLaws(eqNumber, float);
  eqLaws(eqNumber, bigInt);
});

Deno.test("eqBoolean for string type obeys Setoid Laws", () => {
  eqLaws(eqBoolean, boolean);
});

Deno.test("eqDate for Date type obeys Setoid Laws", () => {
  eqLaws(eqDate, date);
});

Deno.test("eqArray for Array type obeys Setoid Laws", () => {
  const generator = () => array(integer());
  eqLaws(eqArray, generator);
});

Deno.test("getTupleEq combinator obeys Setoid Laws and check equality on Tuples", () => {
  const eqTriple = getTupleEq(
    eqString,
    eqString,
    eqString,
  );

  const triple = () => genericTuple([string(), string(), string()]);

  eqLaws(eqTriple, triple);

  expect(eqTriple(["a", "b", "c"], ["a", "b", "c"])).toBeTruthy();
  expect(eqTriple(["a", "b", "c"], ["a", "a", "c"])).toBeFalsy();
});

Deno.test("getStructEq combinator obeys Setoid Laws and check equality on Records", () => {
  const eqPoint = getStructEq({
    x: eqNumber,
    y: eqNumber,
  });

  const point = () => record({ x: integer(), y: integer() }, undefined);

  eqLaws(eqPoint, point);

  expect(eqPoint({ x: 1, y: 1 }, { x: 1, y: 1 })).toBeTruthy();
  expect(eqPoint({ x: 1, y: 1 }, { x: 1, y: 2 })).toBeFalsy();
});

Deno.test(
  `Contramap obeys Setoid Laws and results yielded 
          from the setoid and its contravariant are similar 
          when applied respectively to a set of source and their images`,
  () => {
    type BoxedNumber = { value: number };
    const unboxValue = (x: BoxedNumber): number => x.value;

    const eqBoxedNumber = contramap(unboxValue)(eqNumber);

    eqLaws(eqBoxedNumber, integer);

    assert(
      property(
        integer(),
        integer(),
        (x: number, y: number) =>
          expect(eqNumber(x, y)).toEqual(
            eqBoxedNumber({ value: x }, { value: y }),
          ),
      ),
      undefined,
    );
  },
);
