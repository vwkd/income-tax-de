import { assertEquals } from "@std/assert";
import { parameters } from "../src/data.ts";
import { IncomeTax } from "../src/main.ts";

for (const { fromYear, toYear, pieces } of parameters) {
  Deno.test(`${fromYear}-${toYear}`, () => {
    const incomeTax = new IncomeTax(fromYear);

    for (const { start, end: endMaybe, rateMargin } of pieces) {
      const end = endMaybe === Infinity ? start + 1 : endMaybe;
      const mid = (start + end) / 2;
      assertEquals(incomeTax.rateMargin(start), rateMargin(start));
      assertEquals(incomeTax.rateMargin(mid), rateMargin(mid));
      assertEquals(incomeTax.rateMargin(end), rateMargin(end));
    }
  });
}
