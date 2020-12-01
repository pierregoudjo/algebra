import type {
  Empty,
  Invert,
  OrdFn,
  SemigroupFn,
  SetoidFn,
} from "./types/operations.ts";

export const equals: SetoidFn<number> = ((x, y) => x === y);

export const lte: OrdFn<number> = ((x, y) => x <= y);

export const add: SemigroupFn<number> = (x, y) => x + y;

export const additionEmpty: Empty<number> = () => 0;

export const additionInvert: Invert<number> = (x) => -x;

export const multiply: SemigroupFn<number> = (x, y) => x * y;

export const multiplicationEmpty: Empty<number> = () => 1;

export const multiplicationInvert: Invert<number> = (x) => 1 / x;
