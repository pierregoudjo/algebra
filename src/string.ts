import type {
  Empty,
  OrdFn,
  SemigroupFn,
  SetoidFn,
} from "./types/operations.ts";

import { ordFnfrom, setoidFnfrom } from "./types/utils.ts";

export const equals: SetoidFn<string> = setoidFnfrom(
  ((x, y) => x.localeCompare(y) == 0) as SetoidFn<string>,
);

export const lte: OrdFn<string> = ordFnfrom((x, y) => x.localeCompare(y) <= 0);

export const concat: SemigroupFn<string> = (x, y) => x + y;

export const empty: Empty<string> = () => "";
