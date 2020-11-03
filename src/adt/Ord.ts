declare const ord: unique symbol;

export type Ord<T> = {
  [ord]: true;
  (x: T, y: T): boolean;
};

export const fromLte = <T>(lte: (x: T, y: T) => boolean): Ord<T> =>
  ((x, y) => x === y || lte(x, y)) as Ord<T>;

export const contramap = <A, B>(fn: (b: B) => A) =>
  (o: Ord<A>): Ord<B> => ((x, y) => o(fn(x), fn(y))) as Ord<B>;

const naturalLte = <T>(x: T, y: T) => x <= y;

export const ordString = naturalLte as Ord<string>;
export const ordNumber = naturalLte as Ord<number>;
export const ordBoolean = naturalLte as Ord<boolean>;
export const ordDate = ((x, y) => x.getTime() <= y.getTime()) as Ord<Date>;

export const min = <T>(o: Ord<T>) => (x: T, y: T): T => o(x, y) ? x : y;
export const max = <T>(o: Ord<T>) => (x: T, y: T): T => !o(x, y) ? y : x;
export const between = <T>(o: Ord<T>) =>
  (low: T, hi: T) => (x: T): boolean => o(low, x) && o(x, hi);
