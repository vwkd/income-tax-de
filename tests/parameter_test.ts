import { assertEquals } from "@std/assert";
import { parameters } from "../src/data.ts";

const years = parameters.flatMap(({ year }) =>
  Array.isArray(year)
    ? Array.from({ length: year[1] - year[0] + 1 }, (_, i) => year[0] + i)
    : year
);

Deno.test("years unique", () => {
  assertEquals([...new Set(years)].length, years.length);
});

Deno.test("years in order without gaps", () => {
  for (let i = 0; i < years.length; i++) {
    assertEquals(years[i], years[0] + i);
  }
});

for (const year of years) {
  Deno.test(`${year} breakpoints in order without gaps`, () => {
    const parameter = parameters.find(({ year: y }) =>
      Array.isArray(y) ? y[0] <= year && year <= y[1] : y === year
    )!;

    const first = parameter.pieces.at(0)!;
    const last = parameter.pieces.at(-1)!;

    assertEquals(first.start, 0);
    assertEquals(last.end, Infinity);
    for (let i = 0; i < parameter.pieces.length - 1; i += 1) {
      assertEquals(parameter.pieces[i].end, parameter.pieces[i + 1].start - 1);
    }
  });
}
