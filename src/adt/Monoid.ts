import * as S from "./Semigroup.ts";
import type { Semigroup } from "./Semigroup.ts";

declare const monoid: unique symbol;

type Empty<T> = T;

export type Monoid<T> = Semigroup<T> & {
  [monoid]: true;
  readonly empty: Empty<T>;
};

export const from = <T>(
  empty: Readonly<Empty<T>>,
  fn: Semigroup<T>,
) => {
  // deno-lint-ignore no-explicit-any
  const _f = fn as any;
  _f.empty = empty;

  return _f as Monoid<T>;
};

export const concatString = from("", S.concatString);
export const addNumber = from(0, S.addNumber);
export const addBigInt = from(0n, S.addBigInt);
export const multiplyNumber = from(1, S.multiplyNumber);
export const multiplyBigInt = from(1n, S.multiplyBigInt);
export const concatArray = from([], S.concatArray);

export const fold = <T>(fn: Monoid<T>) => S.fold(fn)(fn.empty);
