import { monoidLaws, ordLaws, semigroupLaws, setoidLaws } from "./laws.ts";
import { fc } from "../deps.ts";
import {
  and,
  emptyAnd,
  emptyOr,
  equals,
  lte,
  not,
  or,
} from "../src/boolean.ts";
import { expect } from "https://deno.land/x/expect@v0.2.6/expect.ts";

Deno.test("equals on boolean is a setoid", () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (x, y, z) => {
      setoidLaws(equals)(x, y, z);
    }),
    undefined,
  );
});

Deno.test("lte on boolean is an Ord", () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (x, y, z) => {
      ordLaws(lte, equals)(x, y, z);
    }),
    undefined,
  );
});

Deno.test("Boolean with logical conjuction (and, &&) is a semigroup", () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (x, y, z) => {
      semigroupLaws(and)(x, y, z);
    }),
    undefined,
  );
});

Deno.test("Boolean with logical conjuction (and, &&) and True is a monoid", () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (x, y, z) => {
      monoidLaws(and, emptyAnd)(x, y, z);
    }),
    undefined,
  );
});

Deno.test("Boolean with logical disjunction (and, &&) is a semigroup", () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (x, y, z) => {
      semigroupLaws(or)(x, y, z);
    }),
    undefined,
  );
});

Deno.test("Boolean with logical disjunction (and, &&) and False is a monoid", () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (x, y, z) => {
      monoidLaws(or, emptyOr)(x, y, z);
    }),
    undefined,
  );
});

Deno.test("Boolean with negation follows some properties (double negation, distributivity)", () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (x, y) => {
      expect(not(not(x))).toEqual(x);
      expect(not(and(x, y))).toEqual(or(not(x), not(y)));
      expect(not(or(x, y))).toEqual(and(not(x), not(y)));
    }),
    undefined,
  );
});
