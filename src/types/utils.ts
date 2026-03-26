// Tuple of length N in O(digits) depth
// e.g. NTuple<1960> → only 4 recursive steps
type Digits = {
  "0": [];
  "1": [1];
  "2": [1, 1];
  "3": [1, 1, 1];
  "4": [1, 1, 1, 1];
  "5": [1, 1, 1, 1, 1];
  "6": [1, 1, 1, 1, 1, 1];
  "7": [1, 1, 1, 1, 1, 1, 1];
  "8": [1, 1, 1, 1, 1, 1, 1, 1];
  "9": [1, 1, 1, 1, 1, 1, 1, 1, 1];
};

type Times10<T extends 1[]> = [
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
];

type NTuple<N extends number | string, R extends 1[] = []> = `${N}` extends
  `${infer D extends keyof Digits}${infer Rest}`
  ? NTuple<Rest, [...Times10<R>, ...Digits[D]]>
  : R;
//  "1960" → D="1" R=[]      → recurse with [1]          (len 1)
//  "960"  → D="9" R=[1]     → recurse with [...10, +9]   (len 19)
//  "60"   → D="6" R=[×19]   → recurse with [...190, +6]  (len 196)
//  "0"    → D="0" R=[×196]  → recurse with [...1960]     (len 1960)
//  ""     → done ✓

export type _IntRange<
  To extends number,
  Cur extends 1[],
  Acc extends number[] = [],
> = Cur["length"] extends To ? [...Acc, To] // done — include To
  : _IntRange<To, [...Cur, 1], [...Acc, Cur["length"]]>; // tail-recursive

// Inclusive integer range [From, To]
// Tail-recursive via accumulator → safe for 100s of years
export type IntRange<From extends number, To extends number> = _IntRange<
  To,
  NTuple<From>
>;

export type Last<T extends readonly unknown[]> = T extends
  readonly [...unknown[], infer L] ? L
  : never;
