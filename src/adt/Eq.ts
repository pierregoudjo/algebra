declare const eq: unique symbol;

/**
 * Eq type class represents types that supports decidable equality
 */
export type Eq<A> = {
  [eq]: true;
  (x: A, y: A): boolean;
};

/**
 * fromEquals generate a type class from an equality function. It tests in priority reference equality
 * @param equals Equality function
 */
export const fromEquals = <A>(equals: (x: A, y: A) => boolean): Eq<A> =>
  ((x, y) => x === y || equals(x, y)) as Eq<A>;

/**
 * Strict equality
 * @param x First value to test
 * @param y Second value to test
 */
export const eqStrict: Eq<unknown> = ((x, y) => x === y) as Eq<unknown>;
export const eqString: Eq<string> = ((x, y) => x.localeCompare(y) == 0) as Eq<
  string
>;
export const eqNumber: Eq<number> = eqStrict;
export const eqBoolean: Eq<boolean> = eqStrict;
export const eqDate: Eq<Date> = fromEquals((x, y) =>
  x.getTime() === y.getTime()
);
export const eqArray: Eq<unknown[]> = fromEquals((x, y) =>
  x.length === y.length && x.every((v, i) => v == y[i])
);

export function getTupleEq<T extends ReadonlyArray<Eq<never>>>(
  ...eqs: T
): Eq<{ [K in keyof T]: T[K] extends Eq<infer A> ? A : never }> {
  return fromEquals((x, y) => eqs.every((E, i) => E(x[i], y[i])));
}

export const getStructEq = <O extends Record<string, unknown>>(
  eqs: { [K in keyof O]: Eq<O[K]> },
): Eq<O> =>
  fromEquals((x, y) =>
    Object.entries(eqs).every(([key, eq]) => eq(x[key], y[key]))
  );

export const contramap = <A, B>(fn: (b: B) => A) =>
  (eq: Eq<A>): Eq<B> => ((x, y) => eq(fn(x), fn(y))) as Eq<B>;
