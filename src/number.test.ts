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
  between,
  equals,
  gt,
  gte,
  lt,
  lte,
  max,
  min,
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

Deno.test("Min and max return respectively the minimum and maximum between two numbers", () => {
  fc.assert(fc.property(
    fc.integer(),
    fc.integer(),
    (x, y) => {
      expect(min(x, y) === x).toEqual(lte(x, y));
      expect(max(x, y) === x).toEqual(gte(x, y));
      expect(min(x, y) === x && max(x, y) === x).toEqual(equals(x, y));
      expect(min(x, y) === x).toEqual(max(x, y) === y);
    },
  ));
});

Deno.test("Between returns true if a value is between two numbers", () => {
  fc.assert(fc.property(
    fc.integer(),
    fc.integer(),
    fc.integer(),
    (x, y, z) => {
      expect(between(x, z)(y)).toEqual(min(x, y) === x && max(y, z) === z);
    },
  ));
});

Deno.test("gt, gte, lt", () => {
  fc.assert(fc.property(
    fc.integer(),
    fc.integer(),
    (x, y) => {
      expect(gt(x, y)).toEqual(gte(x, y) && !equals(x, y));
      expect(lt(x, y)).toEqual(lte(x, y) && !equals(x, y));
      expect(gte(x, y)).toEqual(equals(x, y) || gt(x, y));
    },
  ));
});
