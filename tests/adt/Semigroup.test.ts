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

import { expect } from "https://deno.land/x/expect/mod.ts";
import {
  addBigInt,
  addNumber,
  concatArray,
  concatString,
  fold,
  getStructSemigroup,
  getTupleSemigroup,
  multiplyNumber,
} from "../../src/adt/Semigroup.ts";

import type { Semigroup } from "../../src/adt/Semigroup.ts";

const associativity = <T>(
  concat: Semigroup<T>,
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

Deno.test("concatString is an associative binary operation on strings and concat two strings together ", () => {
  assert(associativity(concatString, string), undefined);
});

Deno.test("addNumber is an associative binary operation on numbers and add two numbers together ", () => {
  assert(associativity(addNumber, integer), undefined);
  assert(associativity(addNumber, float), undefined);
  assert(associativity(addBigInt, bigInt), undefined);
});

Deno.test("multiplyNumber is an associative binary operation on numbers and multiply two numbers together ", () => {
  assert(associativity(multiplyNumber, bigInt), undefined);
  assert(associativity(multiplyNumber, float), undefined);
});

Deno.test("concatArray is an associative binary operation on arrays and concat two arrays together", () => {
  const generator = () => array(string());
  assert(associativity(concatArray, generator), undefined);
});

Deno.test(
  `getTupleSemigroup generate an associative binary operation 
that concats together the elements of a tuple`,
  () => {
    type Tuple = Readonly<[string, number]>;

    const tuple = () => genericTuple([string(), integer()]);
    const tupleConcatenation = getTupleSemigroup(
      [concatString, addNumber] as const,
    );
    assert(associativity(tupleConcatenation, tuple), undefined);

    assert(
      property(
        tuple(),
        tuple(),
        (x: Tuple, y: Tuple) => {
          const result = tupleConcatenation(x, y);
          expect(result[0]).toEqual(concatString(x[0], y[0]));
          expect(result[1]).toEqual(addNumber(x[1], y[1]));
        },
      ),
      undefined,
    );
  },
);

Deno.test(
  `getStructSemigroup generates an associative binary operation 
that concats together the elements of a record`,
  () => {
    type Point = { x: number; y: number };
    const addCoordinates = getStructSemigroup({ x: addNumber, y: addNumber });
    const point = () => record({ x: integer(), y: integer() }, undefined);

    assert(associativity(addCoordinates, point), undefined);

    assert(
      property(point(), point(), (a: Point, b: Point) => {
        const newPoint = addCoordinates(a, b);
        expect(newPoint.x).toEqual(addNumber(a.x, b.x));
        expect(newPoint.y).toEqual(addNumber(a.y, b.y));
      }),
      undefined,
    );
  },
);

Deno.test("fold is a function that given a sequence, concat them and return the total starting with a value", () => {
  const assertFoldingConcat = <T>(
    semigroup: Semigroup<T>,
    generator: (...args: unknown[]) => unknown,
  ) =>
    assert(
      property(
        generator(),
        generator(),
        generator(),
        (x: T, y: T, z: T) => {
          expect(fold(semigroup)(x)([y, z])).toEqual(
            semigroup(x, semigroup(y, z)),
          );
        },
      ),
      undefined,
    );

  const arrayOfString = () => array(string());
  assertFoldingConcat(addNumber, integer);
  assertFoldingConcat(concatString, string);
  assertFoldingConcat(multiplyNumber, float);
  assertFoldingConcat(concatArray, arrayOfString);
});
