import type { OrdFn, SetoidFn } from "./types/operations.ts";
import { ordFnfrom, setoidFnfrom } from "./types/utils.ts";

export const equals: SetoidFn<Date> = setoidFnfrom((x, y) =>
  x.getTime() === y.getTime()
);

export const lte: OrdFn<Date> = ordFnfrom((x, y) => x.getTime() <= y.getTime());
