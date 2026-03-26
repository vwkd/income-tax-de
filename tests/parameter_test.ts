import { assertEquals, assertGreaterOrEqual } from "@std/assert";
import { parameters } from "../src/data.ts";

Deno.test("years in order without gaps", () => {
  for (let i = 0; i < parameters.length - 1; i += 1) {
    assertGreaterOrEqual(parameters[i].toYear, parameters[i].fromYear);
    if (i > 0) {
      assertEquals(parameters[i].fromYear, parameters[i - 1].toYear + 1);
    }
  }
});

for (const { fromYear, toYear, pieces } of parameters) {
  Deno.test(`${fromYear}-${toYear} breakpoints in order without gaps`, () => {
    const first = pieces.at(0)!;
    const last = pieces.at(-1)!;

    assertEquals(first.start, 0);
    assertEquals(last.end, Infinity);
    for (let i = 0; i < pieces.length - 1; i += 1) {
      assertEquals(pieces[i].end, pieces[i + 1].start - 1);
    }
  });
}
