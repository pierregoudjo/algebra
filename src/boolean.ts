import type { OrdFn, SetoidFn } from "./types/operations.ts";

export const eqBoolean: SetoidFn<boolean> = ((x, y) => x === y);

export const lte: OrdFn<boolean> = (x, y) => x <= y;
