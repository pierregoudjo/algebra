import { expect } from "https://deno.land/x/expect/mod.ts";
import {
  addNumber,
  concatArray,
  concatString,
  fold,
  Monoid,
  multiplyNumber,
} from "../../src/adt/Monoid.ts";
import {
  array,
  assert,
  bigInt,
  float,
  genericTuple,
  integer,
  property,
  record,
  string,
} from "https://cdn.skypack.dev/fast-check";

const associativity = <T>(
  concat: Monoid<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(
    generator(),
    generator(),
    generator(),
    (x: T, y: T, z: T) => {
      expect(concat(x, concat(y, z))).toEqual(concat(concat(x, y), z));
    },
  );

const rightIdentity = <T>(
  concat: Monoid<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(generator(), (x: T) => expect(concat(x, concat.empty)).toEqual(x));

const leftIdentity = <T>(
  concat: Monoid<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(generator(), (x: T) => expect(concat(concat.empty, x)).toEqual(x));

const monoidLaws = <T>(
  concat: Monoid<T>,
  generator: (...args: unknown[]) => unknown,
) => {
  assert(associativity(concat, generator), undefined);
  assert(rightIdentity(concat, generator), undefined);
  assert(leftIdentity(concat, generator), undefined);
};

Deno.test("concatString is an associative binary operation with an identity element following Monoid laws", () => {
  monoidLaws(concatString, string);
});
Deno.test("addNumber is an associative binary operation with an identity element following Monoid laws", () => {
  monoidLaws(addNumber, integer);
  monoidLaws(addNumber, float);
});

Deno.test("multiplyNumber is an associative binary operation with an identity element following Monoid laws", () => {
  monoidLaws(multiplyNumber, float);
});

Deno.test("concatArray is an associative binary operation with an identity element following Monoid laws", () => {
  const arrayOf = (generator: (...args: unknown[]) => unknown) =>
    () => array(generator());
  monoidLaws(concatArray, arrayOf(string));
  monoidLaws(concatArray, arrayOf(integer));
});

Deno.test("fold is a function that given a sequence, concat them and return the total", () => {
  const assertFoldConcatElements = <T>(monoid: Monoid<T>, generator:(...args: unknown[]) => unknown) => assert(
    property(
      generator(),
      generator(),
      (x: T, y: T) => {
        expect(fold(monoid)([x, y])).toEqual(
          monoid(monoid.empty, monoid(x, y))
        );
      }
    ),
    undefined
  );
  
  const arrayOfString = () => array(string())

  assertFoldConcatElements(addNumber, integer)
  assertFoldConcatElements(concatString, string)
  assertFoldConcatElements(multiplyNumber, float)
  assertFoldConcatElements(concatArray, arrayOfString)
});
