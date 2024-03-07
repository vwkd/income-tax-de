import { assertAlmostEquals, assertEquals } from "@std/assert";
import { parameters } from "../src/data/steuerbetrag.ts";
import { Steuer } from "../src/main.ts";
import { Inflation } from "@vwkd/inflation";

const TOLERANCE = 0.0001;

const years = parameters.map((p) => p.Jahr);

for (const year of years) {
  Deno.test(`${year}`, () => {
    const inflation = new Inflation({}, {});
    const parameter = parameters.find((p) => p.Jahr == year)!;
    const steuer = new Steuer(parameter, inflation);

    assertEquals(steuer.grenzsteuersatz(0), 0);
    assertEquals(steuer.grenzsteuersatz(parameter.E0), 0);
    assertAlmostEquals(
      steuer.grenzsteuersatz(parameter.E0 + 1),
      parameter.sg1,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.grenzsteuersatz(parameter.E1 + 1),
      parameter.sg2,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.grenzsteuersatz(parameter.E2 + 1),
      parameter.sg3,
      TOLERANCE,
    );
    assertAlmostEquals(
      steuer.grenzsteuersatz(parameter.E3 + 1),
      parameter.sg4,
      TOLERANCE,
    );
  });
}
