import { expect } from "../deps.ts";
import { fc } from "../deps.ts";
import { compose, constant, identity, memoize, trace } from "./functions.ts";

Deno.test("memoized function return the same value everytime it's called", () => {
  const fn = (x: number) => x + Math.random();
  const memoizedFn = memoize(fn);
  fc.assert(
    fc.property(fc.integer(), (x) => {
      expect((memoizedFn(x))).toEqual(memoizedFn(x));
    }),
  );
});

Deno.test("trace function return the same value it has been passed as argument", () => {
  fc.assert(
    fc.property(fc.integer(), (x) => {
      expect((trace("Variable")(x))).toEqual(x);
    }),
  );
});

Deno.test("constant function return a function that return same value it has been passed as argument", () => {
  fc.assert(
    fc.property(fc.oneof(fc.integer(), fc.string()), (x) => {
      expect(constant(x)()).toEqual(x);
    }),
  );
});

Deno.test("identity function return the value it has been passed as argument", () => {
  fc.assert(
    fc.property(fc.oneof(fc.integer(), fc.string()), (x) => {
      expect(identity()(x)).toEqual(x);
    }),
  );
});

Deno.test("Function composition is associative", () => {
  fc.assert(
    fc.property(
      fc.func(fc.integer()),
      fc.func(fc.integer()),
      fc.func(fc.string()),
      fc.integer(),
      (f, g, h, x) => {
        expect(compose(f, compose(g, h))(x)).toEqual(
          compose(compose(f, g), h)(x),
        );
      },
    ),
  );
});
