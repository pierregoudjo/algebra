import { expect } from "../deps.ts";
import { fc } from "../deps.ts";
import { monoidLaws, ordLaws, semigroupLaws, setoidLaws } from "./laws.ts";
import { add, additionEmpty, equals, lte } from "./number.ts";
import { getEmptyFn, getOrdFn, getSemigroupFn, getSetoidFn } from "./tuple.ts";

Deno.test("getSetoidFn generate setoid", () => {
  fc.assert(
    fc.property(
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      (x, y, z) => {
        setoidLaws(getSetoidFn([equals, equals] as const))(x, y, z);
      },
    ),
  );
});

Deno.test("getOrdFn generate Ord", () => {
  fc.assert(
    fc.property(
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      (x, y, z) => {
        ordLaws(
          getOrdFn([lte, lte] as const),
          getSetoidFn([equals, equals] as const),
        )(x, y, z);
      },
    ),
  );
});

Deno.test("getSemigroupFn generates a semigroup", () => {
  fc.assert(
    fc.property(
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      (x, y, z) => {
        semigroupLaws(getSemigroupFn([add, add]))(x, y, z);
        expect(x[0] + y[0]).toEqual(getSemigroupFn([add, add])(x,y)[0])
        expect(x[1] + y[1]).toEqual(getSemigroupFn([add, add])(x,y)[1])
      },
    ),
  );
});

Deno.test("getSemigroupFn and getEmptyFn generates a monoid", () => {
  fc.assert(
    fc.property(
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      fc.tuple(fc.integer(), fc.integer()),
      (x, y, z) => {
        monoidLaws(getSemigroupFn([add, add]), getEmptyFn([additionEmpty, additionEmpty]))(x, y, z);
      },
    ),
  );
});