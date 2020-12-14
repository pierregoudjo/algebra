import { expect } from "../deps.ts";
import { fc } from "../deps.ts";
import { monoidLaws, ordLaws, semigroupLaws, setoidLaws } from "./laws.ts";
import { concat, empty, getOrdFn, getSetoidFn } from "../src/array.ts";
import { _ } from "../src/types/operations.ts";

Deno.test("Array with concat is a semigroup", () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      (x, y, z) => {
        semigroupLaws(concat)(x, y, z);
      },
    ),
  );
});

Deno.test("Array with concat and empty is a Monoid", () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      (x, y, z) => {
        monoidLaws(concat, empty)(x, y, z);
        expect(concat(x, y).slice(x.length)).toEqual(y);
      },
    ),
  );
});

Deno.test("getSetoidFn generate setoid", () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      fc.array(
        fc.oneof(
          fc.string(),
          fc.double(),
          fc.bigInt(),
          fc.float(),
          fc.integer(),
        ),
      ),
      (x, y, z) => {
        setoidLaws(getSetoidFn((x, y) => x == y))(x, y, z);
      },
    ),
  );
});

Deno.test("getOrdFn generate Ord", () => {
  fc.assert(
    fc.property(
      fc.array((fc.string())),
      fc.array((fc.string())),
      fc.array((fc.string())),
      (x, y, z) => {
        ordLaws(
          getOrdFn((x: string, y: string) => x >= y, (x, y) => x == y),
          getSetoidFn((x, y) => x == y),
        )(x, y, z);
      },
    ),
  );
});

// Deno.test("Array with filter is a filterable", () => {
//   fc.assert(
//     fc.property(
//       func(boolean()),
//       func(boolean()),
//       fc.array(fc.oneof(fc.string(), fc.double(), fc.bigInt(), fc.float(), fc.integer()), undefined),
//       fc.array(fc.oneof(fc.string(), fc.double(), fc.bigInt(), fc.float(), fc.integer()), undefined),
//       (f: Predicate<unknown>, g: Predicate<unknown>, y: unknown[], z: unknown[]) => {
//         filterableLaws(filter)(f,g,y,z);
//       },
//     ),
//     undefined,
//   );
// });

// Deno.test("Array with map is a functor", () => {
//   fc.assert(
//     fc.property(
//       func(boolean()),
//       func(boolean()),
//       fc.array(fc.oneof(fc.string(), fc.double(), fc.bigInt(), fc.float(), fc.integer()), undefined),
//       fc.array(fc.oneof(fc.string(), fc.double(), fc.bigInt(), fc.float(), fc.integer()), undefined),
//       (f: Predicate<unknown>, g: Predicate<unknown>, y: unknown[], z: unknown[]) => {
//         functorLaws(map)(f,g,y)
//       },
//     ),
//     undefined,
//   );
// });

// Deno.test("Array with reduce is a foldable", () => {
//   fc.assert(
//     fc.property(
//       func(boolean()),
//       func(boolean()),
//       fc.array(fc.oneof(fc.string(), fc.double(), fc.bigInt(), fc.float(), fc.integer()), undefined),
//       fc.array(fc.oneof(fc.string(), fc.double(), fc.bigInt(), fc.float(), fc.integer()), undefined),
//       (f: Predicate<unknown>, g: Predicate<unknown>, y: unknown[], z: unknown[]) => {
//         functorLaws(map)(f,g,y)
//       },
//     ),
//     undefined,
//   );
// });
