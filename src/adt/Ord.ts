declare const ord: unique symbol;

export type Ord<T> = {
  [ord]: true;
  (x: T, y: T): boolean;
};

const naturalLte = (<T>(x: T, y: T) => x <= y) as Ord<unknown>;

export const fromLte = <T>(lte: (x: T, y: T) => boolean): Ord<T> =>
  ((x, y) => (x === y) || lte(x, y)) as Ord<T>;

export const contramap = <A, B>(fn: (b: B) => A) =>
  (o: Ord<A>): Ord<B> => ((x, y) => o(fn(x), fn(y))) as Ord<B>;

export const ordString: Ord<string> = fromLte((x, y) =>
  x.localeCompare(y) <= 0
);
export const ordNumber: Ord<number> = naturalLte;
export const ordBoolean: Ord<boolean> = naturalLte;
export const ordDate: Ord<Date> = fromLte((x, y) => x.getTime() <= y.getTime());

export const gt = <T>(o: Ord<T>) => (x: T, y: T) => !o(x, y);
export const lt = <T>(o: Ord<T>) =>
  (x: T, y: T) => o(x, y) && o(y, x) ? false : o(x, y);
export const gte = <T>(o: Ord<T>) => (x: T, y: T) => !lt(o)(x, y);
export const lte = <T>(o: Ord<T>) => (x: T, y: T) => o(x, y);

export const min = <T>(o: Ord<T>) => (x: T, y: T): T => o(x, y) ? x : y;
export const max = <T>(o: Ord<T>) => (x: T, y: T): T => !o(x, y) ? y : x;
export const between = <T>(o: Ord<T>) =>
  (low: T, hi: T) => (x: T): boolean => o(low, x) && o(x, hi);

export const getTupleOrd = <T extends ReadonlyArray<Ord<never>>>(
  ords: T,
): Ord<{ [K in keyof T]: T[K] extends Ord<infer A> ? A : never }> =>
  fromLte((x, y) => {
    let i = 0;
    const len = ords.length;
    for (; i < len - 1; i++) {
      const ord = ords[i];
      const val1 = x[i];
      const val2 = y[i];
      const r1 = ord(val1, val2);
      const r2 = ord(val2, val1);
      if (!(r1 && r2)) {
        return r1;
      }
    }
    return ords[i](x[i], y[i]);
  });
