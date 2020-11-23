import type { InternalBinaryOperation } from "./InternalBinaryOperation.ts";

declare const semigroup: unique symbol;

export type Semigroup<T> = InternalBinaryOperation<T> & {
  [semigroup]: true;
};

export const from = <T>(fn: InternalBinaryOperation<T>) => fn as Semigroup<T>;
export const concatString: Semigroup<string> = from((x, y) => x + y);
export const addNumber: Semigroup<number> = from((x, y) => x + y);
export const addBigInt: Semigroup<bigint> = from((x, y) => x + y);
export const multiplyNumber: Semigroup<number> = from((x, y) => x * y);
export const multiplyBigInt: Semigroup<bigint> = from((x, y) => x * y);
export const concatArray: Semigroup<unknown[]> = from((x, y) => x.concat(y));

// deno-lint-ignore no-explicit-any
export const getTupleSemigroup = <T extends ReadonlyArray<Semigroup<any>>>(
  semigroups: T,
): Semigroup<{ [K in keyof T]: T[K] extends Semigroup<infer A> ? A : never }> =>
  from((x, y) =>
    // deno-lint-ignore no-explicit-any
    semigroups.map((semigroup, i) => semigroup(x[i], y[i])) as any
  );

export const getStructSemigroup = <T extends Record<string, unknown>>(
  semigroupStruct: { [K in keyof T]: Semigroup<T[K]> },
): Semigroup<T> =>
  from((x, y) =>
    Object.entries(semigroupStruct).map(([key, semigroup]) => ({
      [key]: semigroup(x[key], y[key]),
      // deno-lint-ignore no-explicit-any
    })).reduce((prev, curr) => ({ ...prev, ...curr }), {}) as any
  );

export const fold = <T>(semigroup: Semigroup<T>) =>
  (startWith: T) => (array: T[]) => array.reduce(semigroup, startWith);
