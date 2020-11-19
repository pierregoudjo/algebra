import * as S from "./Semigroup.ts";

declare const monoid: unique symbol;

type Empty<T> = T;

export type Monoid<T> = S.Semigroup<T> & Function & {
  [monoid]: true;
  readonly empty: Empty<T>;
};

export const fromSemigroup = <T>(
  empty: Readonly<Empty<T>>,
  fn: S.Semigroup<T>,
) => {
  const _f = fn as any;
  _f.empty = empty;

  return _f as Monoid<T>;
};

export const concatString = fromSemigroup("", S.concatString);
export const addNumber = fromSemigroup(0, S.addNumber);
export const multiplyNumber = fromSemigroup(1, S.multiplyNumber);
export const concatArray = fromSemigroup([], S.concatArray);

export const fold = <T>(fn: Monoid<T>) => S.fold(fn)(fn.empty);
