import {
  BinaryRelation,
  InternalBinaryOperation,
  OrdFn,
  SemigroupFn,
  SetoidFn,
} from "./operations.ts";

export const contramapEq = <A, B>(fn: (b: B) => A) =>
  (eq: SetoidFn<A>): SetoidFn<B> => ((x, y) => eq(fn(x), fn(y)));

export const contramapOrd = <A, B>(fn: (b: B) => A) =>
  (o: OrdFn<A>): OrdFn<B> => ((x, y) => o(fn(x), fn(y))) as OrdFn<B>;

export const foldWithSemigroup = <T>(semigroup: SemigroupFn<T>) =>
  (startWith: T) => (array: T[]) => array.reduce(semigroup, startWith);

export const gt = <T>(o: OrdFn<T>): BinaryRelation<T> => (x, y) => !o(x, y);

export const lt = <T>(o: OrdFn<T>, e: SetoidFn<T>): BinaryRelation<T> =>
  (x, y) => e(x, y) ? false : o(x, y);

export const gte = <T>(o: OrdFn<T>, e: SetoidFn<T>): BinaryRelation<T> =>
  (x, y) => !lt(o, e)(x, y);

export const min = <T>(o: OrdFn<T>): InternalBinaryOperation<T> =>
  (x, y): T => o(x, y) ? x : y;

export const max = <T>(o: OrdFn<T>): InternalBinaryOperation<T> =>
  (x: T, y: T): T => o(x, y) ? y : x;

export const between = <T>(o: OrdFn<T>) =>
  (low: T, hi: T) => (x: T): boolean => o(low, x) && o(x, hi);

export const setoidFnfrom = <A>(equals: BinaryRelation<A>): SetoidFn<A> =>
  ((x, y) => x === y || equals(x, y)) as SetoidFn<A>;

export const ordFnfrom = <T>(lte: BinaryRelation<T>): OrdFn<T> =>
  ((x, y) => (x === y) || lte(x, y)) as OrdFn<T>;
