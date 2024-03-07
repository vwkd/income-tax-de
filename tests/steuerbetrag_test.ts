import { assertAlmostEquals, assertEquals } from "@std/assert";
import { parameters } from "../src/data/steuerbetrag.ts";
import { Steuer } from "../src/main.ts";
import { Inflation } from "@vwkd/inflation";

const TOLERANCE = 0.5;

const years = parameters.map((p) => p.Jahr);

for (const year of years) {
  Deno.test(`${year}`, () => {
    const inflation = new Inflation({}, {});
    const parameter = parameters.find((p) => p.Jahr == year)!;
    const steuer = new Steuer(parameter, inflation);

    assertEquals(steuer.steuerbetrag(0), 0);
    assertEquals(steuer.steuerbetrag(parameter.E0), 0);
    assertAlmostEquals(
      steuer.steuerbetrag(parameter.E1 + 1),
      parameter.S1,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.steuerbetrag(parameter.E2 + 1),
      parameter.S2,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.steuerbetrag(parameter.E3 + 1),
      parameter.S3,
      TOLERANCE,
    );
  });
}
