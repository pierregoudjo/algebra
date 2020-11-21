import * as S from "./Semigroup.ts";

declare const monoid: unique symbol;

type Empty<T> = T;

export type Monoid<T> = S.Semigroup<T> & {
  [monoid]: true;
  readonly empty: Empty<T>;
};

export const from = <T>(
  empty: Readonly<Empty<T>>,
  fn: S.Semigroup<T>,
) => {
  const _f = fn as any;
  _f.empty = empty;

  return _f as Monoid<T>;
};

export const concatString = from("", S.concatString);
export const addNumber = from(0, S.addNumber);
export const multiplyNumber = from(1, S.multiplyNumber);
export const concatArray = from([], S.concatArray);

export const fold = <T>(fn: Monoid<T>) => S.fold(fn)(fn.empty);
