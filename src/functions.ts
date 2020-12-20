import type {
  _,
  _0,
  _1,
  Fn,
  Id,
  Lazy,
  SemigroupoidFn,
  UnaryFunction,
} from "./types/operations.ts";

export const compose: SemigroupoidFn<UnaryFunction<_0, _1>> = <I, J, K>(
  fjk: UnaryFunction<J, K>,
  fij: UnaryFunction<I, J>,
): UnaryFunction<I, K> => (x) => fjk(fij(x));

export const identity: Id<UnaryFunction<_0, _0>> = () => (x) => x;

export const constant = <A>(x: A): Lazy<A> => () => x;

export const pipe: PipeFn = (...fns: UnaryFunction<unknown, unknown>[]) =>
  (x: unknown) => fns.reduce((val, fn) => fn(val), x);

export const trace = (label: string) =>
  (value: unknown) => {
    console.log(`${label}: ${value} `);
    return value;
  };

export const memoize = <A, B>(fn: UnaryFunction<A, B>): UnaryFunction<A, B> => {
  const cache = new Map();
  return (x) => {
    return cache.has(x) ? cache.get(x) : cache.set(x, fn(x)).get(x);
  };
};

type PipeFn = {
  <A, B>(
    ab: UnaryFunction<A, B>,
  ): UnaryFunction<A, B>;
  <A, B, C>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
  ): UnaryFunction<A, C>;
  <A, B, C, D>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
  ): UnaryFunction<A, D>;
  <A, B, C, D, E>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    de: UnaryFunction<D, E>,
  ): UnaryFunction<A, E>;
  <A, B, C, D, E, F>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
  ): UnaryFunction<A, F>;
  <A, B, C, D, E, F, G>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
  ): UnaryFunction<A, G>;
  <A, B, C, D, E, F, G, H>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
  ): UnaryFunction<A, H>;
  <A, B, C, D, E, F, G, H, I>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>,
  ): UnaryFunction<A, I>;
  <A, B, C, D, E, F, G, H, I, J>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>,
    ij: UnaryFunction<I, J>,
  ): UnaryFunction<A, J>;
  <A, B, C, D, E, F, G, H, I, J, K>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>,
    ij: UnaryFunction<I, J>,
    jk: UnaryFunction<J, K>,
  ): UnaryFunction<A, K>;
  <A, B, C, D, E, F, G, H, I, J, K, L>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>,
    ij: UnaryFunction<I, J>,
    jk: UnaryFunction<J, K>,
    kl: UnaryFunction<K, L>,
  ): UnaryFunction<A, L>;
  <A, B, C, D, E, F, G, H, I, J, K, L>(
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>,
    ij: UnaryFunction<I, J>,
    jk: UnaryFunction<J, K>,
    kl: UnaryFunction<K, L>,
    end: never,
  ): UnaryFunction<A, L>;
};
