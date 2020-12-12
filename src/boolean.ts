import type { Empty, OrdFn, SemigroupFn, SetoidFn } from "./types/operations.ts";

export const equals: SetoidFn<boolean> = ((x, y) => x === y);

export const lte: OrdFn<boolean> = (x, y) => x <= y;

export const and: SemigroupFn<boolean> = (x,y) => x && y

export const emptyAnd: Empty<boolean> = () => true

export const or: SemigroupFn<boolean> = (x,y) => x || y

export const emptyOr:Empty<boolean> = () => false

export const not = (x:boolean) => (!x)