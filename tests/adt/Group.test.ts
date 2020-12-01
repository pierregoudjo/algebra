import { expect } from "https://deno.land/x/expect/mod.ts";
import {
  assert,
  bigInt,
  double,
  float,
  genericTuple,
  integer,
  property,
} from "https://cdn.skypack.dev/fast-check";

import type { Group } from "../../src/adt/Group.ts";
import { addNumber, multiplyNumber } from "../../src/adt/Group.ts";

const rightIdentity = <T>(
  concat: Group<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(
    generator(),
    (x: T) => expect(concat(x, concat.invert(x))).toEqual(concat.empty),
  );

const leftIdentity = <T>(
  concat: Group<T>,
  generator: (...args: unknown[]) => unknown,
) =>
  property(
    generator(),
    (x: T) => expect(concat(concat.invert(x), x)).toEqual(concat.empty),
  );

const groupLaws = <T>(
  concat: Group<T>,
  generator: (...args: unknown[]) => unknown,
) => {
  assert(rightIdentity(concat, generator), undefined);
  assert(leftIdentity(concat, generator), undefined);
};

const rightIdentityWithFloatPrescisionCorrection = <T>(
  group: Group<number>,
  generator: (...args: unknown[]) => unknown,
) => (property(
  generator(),
  (x: number) =>
    expect(Math.round(group(x, group.invert(x)))).toEqual(group.empty),
));

const leftIdentityWithFloatPrescisionCorrection = <T>(
  group: Group<number>,
  generator: (...args: unknown[]) => unknown,
) => (property(
  generator(),
  (x: number) =>
    expect(Math.round(group(group.invert(x), x))).toEqual(group.empty),
));

const groupLawsWithFloatPrecisionCorrection = (
  concat: Group<number>,
  generator: (...args: unknown[]) => unknown,
) => {
  assert(
    rightIdentityWithFloatPrescisionCorrection(concat, generator),
    undefined,
  );
  assert(
    leftIdentityWithFloatPrescisionCorrection(concat, generator),
    undefined,
  );
};

Deno.test("addNumber is an associative binary operation following the group laws", () => {
  groupLaws(addNumber, integer);
  groupLaws(addNumber, float);
});

Deno.test("multiply is an associative binary operation following the group laws on the set of floating number expect 0", () => {
  const floatGenerator = () => float().filter((x: number) => x !== 0.0);

  groupLawsWithFloatPrecisionCorrection(multiplyNumber, floatGenerator);
});
