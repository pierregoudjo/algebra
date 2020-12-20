import type {
  Empty,
  Invert,
  OrdFn,
  SemigroupFn,
  SetoidFn,
} from "./types/operations.ts";
import * as utils from "./types/utils.ts";

export const equals: SetoidFn<number> = ((x, y) => x === y);

export const lte: OrdFn<number> = ((x, y) => x <= y);

export const gt = utils.gt(lte);

export const gte = utils.gte(lte, equals);

export const lt = utils.lt(lte, equals);

export const min = utils.min(lte);

export const max = utils.max(lte);

export const between = utils.between(lte);

export const add: SemigroupFn<number> = (x, y) => x + y;

export const additionEmpty: Empty<number> = () => 0;

export const additionInvert: Invert<number> = (x) => -x;

export const multiply: SemigroupFn<number> = (x, y) => x * y;

export const multiplicationEmpty: Empty<number> = () => 1;

export const multiplicationInvert: Invert<number> = (x) => 1 / x;
