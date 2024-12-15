import { assertEquals } from "@std/assert";
import { parameters } from "../src/data.ts";
import { IncomeTax } from "../src/main.ts";
import { Inflation } from "@vwkd/inflation";

const years = parameters.flatMap(({ year }) =>
  Array.isArray(year)
    ? Array.from({ length: year[1] - year[0] + 1 }, (_, i) => year[0] + i)
    : year
);

for (const year of years) {
  Deno.test(`${year}`, () => {
    const inflation = new Inflation({}, {});
    const incomeTax = new IncomeTax(year, inflation);
    const parameter = parameters.find(({ year: y }) =>
      Array.isArray(y) ? y[0] <= year && year <= y[1] : y === year
    )!;

    for (const { start, end: endMaybe, amount } of parameter.pieces) {
      const end = endMaybe === Infinity ? start + 1 : endMaybe;
      const mid = (start + end) / 2;
      assertEquals(incomeTax.amount(start), amount(start));
      assertEquals(incomeTax.amount(mid), amount(mid));
      assertEquals(incomeTax.amount(end), amount(end));
    }
  });
}
