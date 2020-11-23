import * as M from "./Monoid.ts";
import type { Monoid } from "./Monoid.ts";

declare const group: unique symbol;
declare const notZero: unique symbol;

export type Group<T> = Monoid<T> & {
  [group]: true;
  invert: (x: T) => T;
};

export const from = <T>(invertFn: (x: T) => T, monoid: Monoid<T>) => {
  // deno-lint-ignore no-explicit-any
  const _fn = monoid as any;
  _fn.invert = invertFn;
  return _fn as Group<T>;
};

export const addNumber = from((x) => x === 0 ? 0 : -x, M.addNumber);
export const addBigInt = from((x) => x === 0n ? 0n : -x, M.addBigInt);

export const multiplyNumber = from((x) => 1 / x, M.multiplyNumber);
