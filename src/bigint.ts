import type {
  Empty,
  Invert,
  OrdFn,
  SemigroupFn,
  SetoidFn,
} from "./types/operations.ts";

export const equals: SetoidFn<bigint> = ((x, y) => x === y);

export const lte: OrdFn<bigint> = ((x, y) => x <= y);

export const add: SemigroupFn<bigint> = (x, y) => x + y;

export const additionEmpty: Empty<bigint> = () => 0n;

export const additionInvert: Invert<bigint> = (x) => -x;

export const multiply: SemigroupFn<bigint> = (x, y) => x * y;

export const multiplicationEmpty: Empty<bigint> = () => 1n;

export const multiplicationInvert: Invert<bigint> = (x) => 1n / x;
