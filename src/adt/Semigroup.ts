declare const semigroup: unique symbol;

export type Semigroup<T> = {
  [semigroup]: true;
  (x: T, y: T): T;
};

export const fromConcat = <T>(fn: (x: T, y: T) => T) => fn as Semigroup<T>;
export const concatString: Semigroup<string> = fromConcat((x, y) => x + y);
export const concatNumber: Semigroup<number> = fromConcat((x, y) => x + y);
export const concatArray: Semigroup<unknown[]> = fromConcat((x, y) =>
  x.concat(y)
);
