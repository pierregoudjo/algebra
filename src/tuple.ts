import type {
  Empty,
  OrdFn,
  SemigroupFn,
  SetoidFn,
} from "./types/operations.ts";
import { ordFnfrom, setoidFnfrom } from "./types/utils.ts";

export const getSetoidFn = <T extends ReadonlyArray<SetoidFn<never>>>(
  eqs: T,
): SetoidFn<{ [K in keyof T]: T[K] extends SetoidFn<infer A> ? A : never }> => {
  return setoidFnfrom((x, y) => eqs.every((E, i) => E(x[i], y[i])));
};

export const getOrdFn = <T extends ReadonlyArray<OrdFn<never>>>(
  ords: T,
): OrdFn<{ [K in keyof T]: T[K] extends OrdFn<infer A> ? A : never }> =>
  ordFnfrom((x, y) => {
    let i = 0;
    const len = ords.length;
    for (; i < len - 1; i++) {
      const ord = ords[i];
      const val1 = x[i];
      const val2 = y[i];
      const r1 = ord(val1, val2);
      const r2 = ord(val2, val1);
      if (!(r1 && r2)) {
        return r1;
      }
    }
    return ords[i](x[i], y[i]);
  });

// deno-lint-ignore no-explicit-any
export const getSemigroupFn = <T extends ReadonlyArray<SemigroupFn<any>>>(
  semigroups: T,
): SemigroupFn<
  { [K in keyof T]: T[K] extends SemigroupFn<infer A> ? A : never }
> =>
  // deno-lint-ignore no-explicit-any
  (x, y) => semigroups.map((semigroup, i) => semigroup(x[i], y[i])) as any;

export const getEmptyFn = <T extends ReadonlyArray<Empty<unknown>>>(
  empties: T,
): Empty<{ [K in keyof T]: T[K] extends Empty<infer A> ? A : never }> =>
  () => empties.map((empty) => empty()) as any;

// export {map, reduce} from './array.ts'