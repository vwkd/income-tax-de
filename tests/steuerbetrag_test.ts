import { assertAlmostEquals, assertEquals } from "@std/assert";
import { steuerbetrag } from "../src/data.ts";
import { Steuer } from "../src/mod.ts";
import { Inflation } from "@vwkd/inflation";

const TOLERANCE = 0.5;

const years = steuerbetrag.map((p) => p.Jahr);

for (const year of years) {
  Deno.test(`${year}`, () => {
    const inflation = new Inflation({}, {});
    const params = steuerbetrag.find((p) => p.Jahr == year)!;
    const steuer = new Steuer(params, inflation);

    assertEquals(steuer.steuerbetrag(0), 0);
    assertEquals(steuer.steuerbetrag(params.E0), 0);
    assertAlmostEquals(
      steuer.steuerbetrag(params.E1 + 1),
      params.S1,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.steuerbetrag(params.E2 + 1),
      params.S2,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.steuerbetrag(params.E3 + 1),
      params.S3,
      TOLERANCE,
    );
  });
}
