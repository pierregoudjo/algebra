import {fc} from '../deps.ts'
import { monoidLaws, ordLaws, semigroupLaws, setoidLaws } from "./laws.ts"
import { concat, empty, equals, lte } from "./string.ts"

Deno.test('Equality check on strings', () => {
  fc.assert(fc.property(fc.string(), fc.string(),fc.string(), (x,y,z) => {
    setoidLaws(equals)(x,y,z)
  }))
})

Deno.test('Ordering check on strings', () => {
  fc.assert(fc.property(fc.string(), fc.string(),fc.string(), (x,y,z) => {
    ordLaws(lte, equals)(x,y,z)
  }))
})

Deno.test('Concat on strings is a semigroup', () => {
  fc.assert(fc.property(fc.string(), fc.string(),fc.string(), (x,y,z) => {
    semigroupLaws(concat)(x,y,z)
  }))
})

Deno.test('Concat and empty string on strings is a monoid', () => {
  fc.assert(fc.property(fc.string(), fc.string(),fc.string(), (x,y,z) => {
    monoidLaws(concat, empty)(x,y,z)
  }))
})