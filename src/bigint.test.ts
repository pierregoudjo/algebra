import { fc } from "../deps.ts";
import {
  groupLaws,
  monoidLaws,
  ordLaws,
  semigroupLaws,
  setoidLaws,
} from "./laws.ts";
import {
  add,
  additionEmpty,
  additiveInverse,
  equals,
  lte,
  multiplicationEmpty,
  multiply,
} from "../src/bigint.ts";

Deno.test("equals tests equality on bigints", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      fc.bigInt(),
      (x: bigint, y: bigint, z: bigint) => {
        setoidLaws(equals)(x, y, z);
      },
    ),
    undefined,
  );
});

Deno.test("lte tests order on bigints", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      fc.bigInt(),
      (x: bigint, y: bigint, z: bigint) => {
        ordLaws(lte, equals)(x, y, z);
      },
    ),
    undefined,
  );
});

Deno.test("Bigint with addition is a semigroup", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      fc.bigInt(),
      (x: bigint, y: bigint, z: bigint) => {
        semigroupLaws(add)(x, y, z);
      },
    ),
    undefined,
  );
});

Deno.test("Bigint with addition and 0 is a monoid", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      fc.bigInt(),
      (x: bigint, y: bigint, z: bigint) => {
        monoidLaws(add, additionEmpty)(x, y, z);
      },
    ),
    undefined,
  );
});

Deno.test("Bigint with addition, 0 and additive inverse is a group", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      fc.bigInt(),
      (x: bigint, y: bigint, z: bigint) => {
        groupLaws(add, additionEmpty, additiveInverse)(x, y, z);
      },
    ),
    undefined,
  );
});

Deno.test("Bigint with multiplication is a semigroup", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      fc.bigInt(),
      (x: bigint, y: bigint, z: bigint) => {
        semigroupLaws(multiply)(x, y, z);
      },
    ),
    undefined,
  );
});

Deno.test("Bigint with multiplication and 1 is a monoid", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      fc.bigInt(),
      (x: bigint, y: bigint, z: bigint) => {
        monoidLaws(multiply, multiplicationEmpty)(x, y, z);
      },
    ),
    undefined,
  );
});
