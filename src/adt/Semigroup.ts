// deno-lint-ignore-file no-explicit-any
declare const semigroup: unique symbol;

export type Semigroup<T> = {
  [semigroup]: true;
  (x: T, y: T): T;
};

export const fromConcat = <T>(fn: (x: T, y: T) => T) => fn as Semigroup<T>;
export const concatString: Semigroup<string> = fromConcat((x, y) => x + y);
export const addNumber: Semigroup<number> = fromConcat((x, y) => x + y);
export const multiplyNumber: Semigroup<number> = fromConcat((x, y) => x * y);
export const concatArray: Semigroup<unknown[]> = fromConcat((x, y) =>
  x.concat(y)
);

export const getTupleSemigroup = <T extends ReadonlyArray<Semigroup<any>>>(
  semigroups: T,
): Semigroup<{ [K in keyof T]: T[K] extends Semigroup<infer A> ? A : never }> =>
  fromConcat((x, y) =>
    semigroups.map((semigroup, i) => semigroup(x[i], y[i])) as any
  );

export const getStructSemigroup = <T extends Record<string, unknown>>(
  semigroupStruct: { [K in keyof T]: Semigroup<T[K]> },
): Semigroup<T> =>
  fromConcat((x, y) =>
    Object.entries(semigroupStruct).map(([key, semigroup]) => ({
      [key]: semigroup(x[key], y[key]),
    })).reduce((prev, curr) => ({ ...prev, ...curr }), {}) as any
  );
