import { fc } from "../deps.ts";
import { monoidLaws, semigroupLaws, setoidLaws } from "./laws.ts";
import { add as numberAdd, equals as numberEquals, additionEmpty as numberEmpty } from "./number.ts";
import { add as bigintAdd, equals as bigintEquals, additionEmpty as bigintEmpty } from "./bigint.ts";
import { concat as strConcat, equals as strEquals, empty as strEmpty } from "./string.ts";
import { concat, getSetoidFn as arrayGetSetoidFn, empty as arrayEmpty } from "./array.ts";
import { getEmptyFn, getSemigroupFn, getSetoidFn } from "./struct.ts";

type SomeRecord = {
  str: string;
  int: number;
  arr: Array<string>;
  bigint: bigint;
};
Deno.test("getSetoidFn generate a function that check equality", () => {
  const someRecordEquals = getSetoidFn(
    {
      str: strEquals,
      int: numberEquals,
      arr: arrayGetSetoidFn(strEquals),
      bigint: bigintEquals,
    },
  );
  fc.assert(
    fc.property(
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      (x: SomeRecord, y: SomeRecord, z: SomeRecord) => {
        setoidLaws(someRecordEquals)(x, y, z);
      },
    ),
  );
});

Deno.test("getSemigroupFn generate a function that concat struct together", () => {
  const someRecordConcat   = getSemigroupFn(
    { str: strConcat, int: numberAdd, arr: concat, bigint: bigintAdd },
  );
  fc.assert(
    fc.property(
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      (x: SomeRecord, y: SomeRecord, z: SomeRecord) => {
        semigroupLaws(someRecordConcat)(x, y, z);
      },
    ),
  );
});

Deno.test("getSemigroupFn and getEmptyFn generate functions that form a monoid", () => {
  const someRecordConcat   = getSemigroupFn(
    { str: strConcat, int: numberAdd, arr: concat, bigint: bigintAdd },
  );
  const emptyRecord = getEmptyFn({str: strEmpty, int: numberEmpty, arr: arrayEmpty, bigint: bigintEmpty})
  fc.assert(
    fc.property(
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      fc.record(
        {
          str: fc.string(),
          int: fc.integer(),
          arr: fc.array(fc.string()),
          bigint: fc.bigInt(),
        },
      ),
      (x: SomeRecord, y: SomeRecord, z: SomeRecord) => {
        monoidLaws(someRecordConcat, emptyRecord)(x, y, z);
      },
    ),
  );
});