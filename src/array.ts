import type {
  _,
  Empty,
  FilterableFn,
  FoldableFn,
  FunctorFn,
  OrdFn,
  SemigroupFn,
  SetoidFn,
} from "./types/operations.ts";
import { ordFnfrom, setoidFnfrom } from "./types/utils.ts";

export const concat: SemigroupFn<Array<unknown>> = (x, y) => x.concat(y);

export const empty: Empty<Array<unknown>> = () => [];

export const getSetoidFn = <T>(eq: SetoidFn<T>): SetoidFn<T[]> =>
  setoidFnfrom((x, y) =>
    x.length === y.length && x.every((v, i) => eq(v, y[i]))
  );

export const getOrdFn = <T>(ord: OrdFn<T>, eq: SetoidFn<T>): OrdFn<T[]> =>
  ordFnfrom((a, b) => {
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i++) {
      if (!eq(a[i], b[i])) {
        return ord(a[i], b[i]);
      }
    }
    return a.length <= b.length;
  });

export const filter: FilterableFn<Array<_>> = (predicate, array) =>
  array.filter((x) => predicate(x));

export const map: FunctorFn<Array<_>> = (mapper, array) =>
  array.map((x) => mapper(x));

export const reduce: FoldableFn<Array<_>> = (fn, init, array) =>
  array.reduce((acc, curr) => fn(acc, curr), init);
