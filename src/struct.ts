import type { Empty, SemigroupFn, SetoidFn } from "./types/operations.ts";
import { setoidFnfrom } from "./types/utils.ts";

export const getSetoidFn = <O extends Record<string, unknown>>(
  eqs: { [K in keyof O]: SetoidFn<O[K]> },
): SetoidFn<O> =>
  setoidFnfrom((x, y) =>
    Object.entries(eqs).every(([key, eq]) => eq(x[key], y[key]))
  );

export const getSemigroupFn = <O extends Record<string, unknown>>(
  semigroups: { [K in keyof O]: SemigroupFn<O[K]> },
): SemigroupFn<O> =>
  (x, y) =>
    Object.entries(semigroups).map(([key, semigroup]) => ({
      [key]: semigroup(x[key], y[key]),
    })).reduce((prev, curr) => ({ ...prev, ...curr })) as O;

export const getEmptyFn = <T extends Record<string, unknown>>(
  empties: { [K in keyof T]: Empty<T[K]> },
): Empty<T> =>
  () =>
    Object.entries(empties).map(([key, empty]) => ({
      [key]: empty(),
    })).reduce((prev, curr) => ({ ...prev, ...curr }), {}) as T;
