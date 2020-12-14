import { fc } from "../deps.ts";
import { equals, lte } from "../src/date.ts";
import { ordLaws, setoidLaws } from "./laws.ts";

Deno.test("equals on boolean is a setoid", () => {
  fc.assert(
    fc.property(fc.date(), fc.date(), fc.date(), (x, y, z) => {
      setoidLaws(equals)(x, y, z);
    }),
  );
});

Deno.test("lte on boolean is an Ord", () => {
  fc.assert(
    fc.property(fc.date(), fc.date(), fc.date(), (x, y, z) => {
      ordLaws(lte, equals)(x, y, z);
    }),
  );
});
