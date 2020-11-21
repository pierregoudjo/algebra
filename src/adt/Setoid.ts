import { BinaryRelation } from "./BinaryRelation.ts";

declare const eq: unique symbol;

/**
 * Eq type class represents types that supports decidable equality
 */
export type Setoid<A> = BinaryRelation<A> & {
  [eq]: true;
};

/**
 * fromEquals generate a type class from an equality function. It tests in priority reference equality
 * @param equals Equality function
 */
export const from = <A>(equals: (x: A, y: A) => boolean): Setoid<A> =>
  ((x, y) => x === y || equals(x, y)) as Setoid<A>;

/**
 * Strict equality
 * @param x First value to test
 * @param y Second value to test
 */
export const eqStrict: Setoid<unknown> = ((x, y) => x === y) as Setoid<unknown>;
export const eqString: Setoid<string> =
  ((x, y) => x.localeCompare(y) == 0) as Setoid<
    string
  >;
export const eqNumber: Setoid<number> = eqStrict;
export const eqBoolean: Setoid<boolean> = eqStrict;
export const eqDate: Setoid<Date> = from((x, y) =>
  x.getTime() === y.getTime()
);

export const getEqArray = <T>(eq: Setoid<T>): Setoid<T[]> =>
  from((x, y) => x.length === y.length && x.every((v, i) => eq(v, y[i])));

export const getTupleEq = <T extends ReadonlyArray<Setoid<never>>>(
  eqs: T,
): Setoid<{ [K in keyof T]: T[K] extends Setoid<infer A> ? A : never }> => {
  return from((x, y) => eqs.every((E, i) => E(x[i], y[i])));
};

export const getStructEq = <O extends Record<string, unknown>>(
  eqs: { [K in keyof O]: Setoid<O[K]> },
): Setoid<O> =>
  from((x, y) =>
    Object.entries(eqs).every(([key, eq]) => eq(x[key], y[key]))
  );

export const contramap = <A, B>(fn: (b: B) => A) =>
  (eq: Setoid<A>): Setoid<B> => ((x, y) => eq(fn(x), fn(y))) as Setoid<B>;
