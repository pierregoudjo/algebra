import { expect } from "../deps.ts";
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
  additionInvert,
  equals,
  lte,
  multiplicationEmpty,
  multiplicationInvert,
  multiply,
} from "./number.ts";

Deno.test("Equality check on number", () => {
  fc.assert(
    fc.property(fc.integer(), fc.integer(), fc.integer(), (x, y, z) => {
      setoidLaws(equals)(x, y, z);
    }),
  );
});

Deno.test("Order check on number", () => {
  fc.assert(
    fc.property(fc.integer(), fc.integer(), fc.integer(), (x, y, z) => {
      ordLaws(lte, equals)(x, y, z);
    }),
  );
});

Deno.test("Addition with number is a semigroup", () => {
  fc.assert(
    fc.property(fc.integer(), fc.integer(), fc.integer(), (x, y, z) => {
      semigroupLaws(add)(x, y, z);
    }),
  );
});

Deno.test("Addition and 0 with number is a monoid", () => {
  fc.assert(
    fc.property(fc.integer(), fc.integer(), fc.integer(), (x, y, z) => {
      monoidLaws(add, additionEmpty)(x, y, z);
    }),
  );
});

Deno.test("Addition and 0 and additive inversion with number is a monoid", () => {
  fc.assert(
    fc.property(fc.integer(), fc.integer(), fc.integer(), (x, y, z) => {
      groupLaws(add, additionEmpty, additionInvert)(x, y, z);
    }),
  );
});

Deno.test("Multplication with number is a semigroup", () => {
  fc.assert(
    fc.property(
      fc.integer({ max: 10000, min: -10000 }),
      fc.integer({ max: 10000, min: -10000 }),
      fc.integer({ max: 10000, min: -10000 }),
      (x, y, z) => {
        semigroupLaws(multiply)(x, y, z);
      },
    ),
  );
});

Deno.test("Multplication and 1 with number is a monoid", () => {
  fc.assert(
    fc.property(
      fc.integer({ max: 10000, min: -10000 }),
      fc.integer({ max: 10000, min: -10000 }),
      fc.integer({ max: 10000, min: -10000 }),
      (x, y, z) => {
        monoidLaws(multiply, multiplicationEmpty)(x, y, z);
      },
    ),
  );
});

Deno.test("Multplication and 1 and muliplicative invert with number is a monoid", () => {
  fc.assert(
    fc.property(
      fc.integer({ max: 10000, min: -10000 }).filter((x) => x !== 0),
      fc.integer({ max: 10000, min: -10000 }).filter((x) => x !== 0),
      fc.integer({ max: 10000, min: -10000 }).filter((x) => x !== 0),
      (x, y, z) => {
        monoidLaws(multiply, multiplicationEmpty)(x, y, z);

        //Right inverse
        expect(Math.round(multiply(x, multiplicationInvert(x)))).toEqual(
          multiplicationEmpty(),
        );

        //Left Inverse
        expect(Math.round(multiply(multiplicationInvert(x), x))).toEqual(
          multiplicationEmpty(),
        );
      },
    ),
  );
});
