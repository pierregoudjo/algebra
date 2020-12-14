import { expect } from "../deps.ts";
import {
  $,
  BinaryRelation,
  Empty,
  FilterableFn,
  FoldableFn,
  FunctorFn,
  InternalBinaryOperation,
  Invert,
  OrdFn,
  Predicate,
  SemigroupFn,
  SetoidFn,
  UnknownFn,
} from "../src/types/operations.ts";

const reflexivity = <T>(fn: BinaryRelation<T>) =>
  (x: T) => {
    expect(fn(x, x)).toBeTruthy();
  };
const symmetry = <T>(fn: BinaryRelation<T>) =>
  (x: T, y: T) => {
    expect(
      fn(x, y),
    ).toEqual(
      fn(y, x),
    );
  };

const transitivity = <T>(fn: BinaryRelation<T>) =>
  (x: T, y: T, z: T) => {
    expect(
      fn(x, y) && fn(y, z) ? fn(x, z) : true,
    ).toBeTruthy();
  };

const associativity = <T>(fn: InternalBinaryOperation<T>) =>
  (x: T, y: T, z: T) => {
    expect(
      fn(x, fn(y, z)),
    ).toEqual(
      fn(fn(x, y), z),
    );
  };

const totality = <T>(fn: BinaryRelation<T>) =>
  (x: T, y: T) => {
    expect(fn(x, y) || fn(y, x)).toBeTruthy();
  };

const antisymmetry = <T>(fn: BinaryRelation<T>, fn2: BinaryRelation<T>) =>
  (x: T, y: T) => {
    expect(fn(x, y) && fn(y, x) ? fn2(x, y) : true).toBeTruthy();
  };

const rightIdentity = <T>(fn: InternalBinaryOperation<T>, empty: Empty<T>) =>
  (x: T) => {
    expect(fn(x, empty())).toEqual(x);
  };

const leftIdentity = <T>(fn: InternalBinaryOperation<T>, empty: Empty<T>) =>
  (x: T) => {
    expect(fn(empty(), x)).toEqual(x);
  };

const rightInverse = <T>(
  fn: InternalBinaryOperation<T>,
  empty: Empty<T>,
  invert: Invert<T>,
) =>
  (x: T) => {
    expect(fn(x, invert(x))).toEqual(empty());
  };

const leftInverse = <T>(
  fn: InternalBinaryOperation<T>,
  empty: Empty<T>,
  invert: Invert<T>,
) =>
  (x: T) => {
    expect(fn(invert(x), x)).toEqual(empty());
  };

// const filterableDistributivity = <T, A>(fn: FilterableFn<T>) =>
//   (f: (x: A) => boolean, g: (x: A) => boolean, a: $<T, [A]>) => {
//     expect(fn((x) => f(x) && g(x), a)).toEqual(fn(g, fn(f, a)));
//   };

// const filterableIdentity = <T, A>(fn: FilterableFn<T>) =>
//   (a: $<T, [A]>) => {
//     expect(fn(() => true, a)).toEqual(a);
//   };

// const filterableAnnihilation = <T, A>(fn: FilterableFn<T>) =>
//   (a: $<T, [A]>, b: $<T, [A]>) => {
//     expect(fn(() => false, a)).toEqual(fn(() => false, b));
//   };

// const functorIdentity = <T, A>(fn: FunctorFn<T>) =>
//   (a: $<T, [A]>) => {
//     expect(fn((x) => x, a)).toEqual(a);
//   };

// const functorComposition = <T, A, B, C>(fn: FunctorFn<T>) =>
//   (f: (x: B) => C, g: (x: A) => B, a: $<T, [A]>) => {
//     expect(fn((x) => f(g(x)), a)).toEqual(fn(f, fn(g, a)));
//   };

export const setoidLaws = <T>(fn: SetoidFn<T>) =>
  (x: T, y: T, z: T) => {
    reflexivity(fn)(x);
    symmetry(fn)(x, y);
    transitivity(fn)(x, y, z);
  };

export const ordLaws = <T>(lte: OrdFn<T>, equals: SetoidFn<T>) =>
  (x: T, y: T, z: T) => {
    setoidLaws(equals)(x, y, z);
    totality(lte)(x, y);
    antisymmetry(lte, equals)(x, y);
    transitivity(lte)(x, y, z);
  };

export const semigroupLaws = <T>(fn: SemigroupFn<T>) =>
  (x: T, y: T, z: T) => {
    associativity(fn)(x, y, z);
  };

export const monoidLaws = <T>(fn: SemigroupFn<T>, empty: Empty<T>) =>
  (x: T, y: T, z: T) => {
    semigroupLaws(fn)(x, y, z);
    rightIdentity(fn, empty)(x);
    leftIdentity(fn, empty)(x);
  };

export const groupLaws = <T>(
  fn: SemigroupFn<T>,
  empty: Empty<T>,
  invert: Invert<T>,
) =>
  (x: T, y: T, z: T) => {
    monoidLaws(fn, empty)(x, y, z);
    rightInverse(fn, empty, invert)(x);
    leftInverse(fn, empty, invert)(x);
  };

// export const filterableLaws = <T>(fn: FilterableFn<T>) =>
//   (
//     f: Predicate<unknown>,
//     g: Predicate<unknown>,
//     a: $<T, [unknown]>,
//     b: $<T, [unknown]>,
//   ) => {
//     filterableDistributivity(fn)(f, g, a);
//     filterableIdentity(fn)(a);
//     filterableAnnihilation(fn)(a, b);
//   };

// export const functorLaws = <T>(fn: FunctorFn<T>) =>
//   (f: UnknownFn, g: UnknownFn, a: $<T, [unknown]>) => {
//     functorIdentity(fn)(a);
//     functorComposition(fn)(f, g, a);
//   };

// export const foldableLaws = <T>(fn:FoldableFn<T>) => <A,B>(f:(acc: A, curr: B) => A, x: A, u:$<T,[A]>) => {
//   fn((acc:any[], curr) => acc.concat(curr), [], u).reduce(f, x)
// }
