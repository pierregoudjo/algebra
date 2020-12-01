import type { Empty, SemigroupFn, SetoidFn } from "./types/operations.ts";
import { setoidFnfrom } from "./types/utils.ts";

export const getSetoidFn = <O extends Record<string, unknown>>(
  eqs: { [K in keyof O]: SetoidFn<O[K]> },
): SetoidFn<O> =>
  setoidFnfrom((x, y) =>
    Object.entries(eqs).every(([key, eq]) => eq(x[key], y[key]))
  );

export const getSemigroupFn = <T extends Record<string, SemigroupFn<unknown>>>(
  semigroupStruct: { [K in keyof T]: SemigroupFn<T[K]> },
): SemigroupFn<T> =>
  (x, y) =>
    Object.entries(semigroupStruct).map(([key, semigroup]) => ({
      [key]: semigroup(x[key], y[key]),
    })).reduce((prev, curr) => ({ ...prev, ...curr }), {}) as any;

export const getEmptyFn = <T extends Record<string, Empty<unknown>>>(
  emptyStruct: { [K in keyof T]: Empty<T[K]> },
): Empty<T> =>
  () =>
    Object.entries(emptyStruct).map(([key, empty]) => ({
      [key]: empty(),
    })).reduce((prev, curr) => ({ ...prev, ...curr }), {}) as any;
