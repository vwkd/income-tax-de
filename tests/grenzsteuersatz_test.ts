import { assertAlmostEquals, assertEquals } from "@std/assert";
import { steuerbetrag } from "../src/data.ts";
import { Steuer } from "../src/mod.ts";
import { Inflation } from "@vwkd/inflation";

const TOLERANCE = 0.0001;

const years = steuerbetrag.map((p) => p.Jahr);

for (const year of years) {
  Deno.test(`${year}`, () => {
    const inflation = new Inflation({}, {});
    const params = steuerbetrag.find((p) => p.Jahr == year)!;
    const steuer = new Steuer(params, inflation);

    assertEquals(steuer.grenzsteuersatz(0), 0);
    assertEquals(steuer.grenzsteuersatz(params.E0), 0);
    assertAlmostEquals(
      steuer.grenzsteuersatz(params.E0 + 1),
      params.sg1,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.grenzsteuersatz(params.E1 + 1),
      params.sg2,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.grenzsteuersatz(params.E2 + 1),
      params.sg3,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.grenzsteuersatz(params.E3 + 1),
      params.sg4,
      TOLERANCE,
    );
  });
}
