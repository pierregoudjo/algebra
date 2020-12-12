export type InternalBinaryOperation<T> = (x: T, y: T) => T;

export type BinaryRelation<T> = (x: T, y: T) => boolean;

export type Empty<T> = Lazy<T>;

export type Invert<T> = (x: T) => T;

export type Id<T> = <I, J>() => $<T, [I, J]>;

export type Zero<T> = <A>() => $<T, [A]>;

export type Predicate<A> = {
  (a: A): boolean;
};

export type UnaryFunction<A, B> = (x: A) => B;

export type SetoidFn<T> = BinaryRelation<T>;

export type OrdFn<T> = BinaryRelation<T>;

export type SemigroupFn<T> = InternalBinaryOperation<T>;

// export type MonoidFn<T> = Empty<T>;

// export type GroupFn<T> = Invert<T>;

export type SemigroupoidFn<T> = <I, J, K>(
  f: $<T, [I, J]>,
  g: $<T, [J, K]>,
) => $<T, [I, K]>;

// export type CategoryFn<T> = Id<T>;

//  Filterable<T> = <a>(a => boolean, T<a>) => T<a>
export type FilterableFn<T> = <A>(
  predicate: Predicate<A>,
  ta: $<T, [A]>,
) => $<T, [A]>;

export type FunctorFn<T> = <A, B>(
  f: (x: A) => B,
  ta: $<T, [A]>,
) => $<T, [B]>;

export type BiFunctorFn<T> = <A, B, C, D>(
  f: (x: A) => B,
  g: (x: C) => D,
  t: $<T, [A, C]>,
) => $<T, [B, D]>;

export type ContravariantFn<T> = <A, B>(
  fn: (x: A) => B,
  aggregate: $<T, [B]>,
) => $<T, [A]>;

export type ProfunctorFn<T> = <A, B, C, D>(
  f: (x: A) => B,
  g: (x: C) => D,
  aggregate: $<T, [B, C]>,
) => $<T, [A, D]>;

export type ApplyFn<T> = {
  <A, B>(tf: $<T, [(x: A) => B]>, aggregate: $<T, [A]>): $<T, [B]>;
};

export type ApplicativeFn<T> = {
  <A>(a: A): $<T, [A]>;
};

export type AltFn<T> = <A>(x: $<T, [A]>, y: $<T, [A]>) => $<T, [A]>;

export type ChainFn<T> = <A, B>(
  f: (x: A) => B,
  aggregate: $<T, [A]>,
) => $<T, [B]>;

export type FoldableFn<T> = <A, B>(
  f: (acc: A, curr: B) => A,
  init: A,
  aggregate: $<T, [B]>,
) => A;

export type ExtendFn<T> = <A, B>(
  f: (x: $<T, [A]>) => B,
  aggregate: $<T, [A]>,
) => $<T, [B]>;

export type ComonadFn<T> = <A>(x: $<T, [A]>) => A;

/***************************************************************************************************
 * @section Utility Types
 **************************************************************************************************/

export type Fn<AS extends unknown[], B> = (...as: AS) => B;

export type UnknownFn = Fn<unknown[], unknown>;

export type Nil = undefined | null;

export interface Lazy<A> {
  (): A;
}

export interface Refinement<A, B extends A> {
  (a: A): a is B;
}

export type Ordering = -1 | 0 | 1;

/***************************************************************************************************
 * @section Hole Types
 * @description Marks a type hole to be filled by the substitution ($) type
 **************************************************************************************************/

declare const index: unique symbol;

export interface _<N extends number = 0> {
  [index]: N;
}
export type _0 = _<0>;
export type _1 = _<1>;
export type _2 = _<2>;
export type _3 = _<3>;
export type _4 = _<4>;
export type _5 = _<5>;
export type _6 = _<6>;
export type _7 = _<7>;
export type _8 = _<8>;
export type _9 = _<9>;

/***************************************************************************************************
 * @section Fix Type
 * @description Fixes a type so it is not replaced by the substitution ($) type
 **************************************************************************************************/

declare const Fix: unique symbol;

export interface Fix<T> {
  [Fix]: T;
}

/***************************************************************************************************
 * @section Substitution Type
 * @description Replaces any type holes in a type with the supplied parameters
 * @example
 *     type FunctorFn<T> = <A, B>(fab: (a: A) => B, ta: $<T, [A]>) => $<T, [B]>;
 *     type ArrayInstance = FunctorFn<Array<_>>;
 *     // ArrayInstance = <A, B>(fab: (a: A) => B, ta: A[]): B[]
 *     type RecordInstance = FunctorFn<{ value: _ }>;
 *     // RecordInstance = <A, B>(fab: (a: A) => B, ta: { value: A }): { value: B }
 **************************************************************************************************/

export type $<T, S extends any[]> = T extends Fix<infer U> ? U
  : T extends _<infer N> ? S[N]
  : T extends any[] ? { [K in keyof T]: $<T[K], S> }
  : T extends Promise<infer I> ? Promise<$<I, S>>
  : T extends Refinement<infer A, infer B> ? Refinement<$<A, S>, $<B, S>>
  : T extends (...x: infer I) => infer O ? (...x: $<I, S>) => $<O, S>
  : T extends object ? { [K in keyof T]: $<T[K], S> }
  : T extends undefined | null | boolean | string | number ? T
  : T;
