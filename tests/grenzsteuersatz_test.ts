import { assertAlmostEquals, assertEquals } from "@std/assert";
import { steuerbetrag } from "../src/data.ts";
import { Steuer } from "../src/mod.ts";
import { Inflation } from "@vwkd/inflation";

const TOLERANCE = 0.0001;

Deno.test("2007", () => {
  const year = 2007;
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

Deno.test("2008", () => {
  const year = 2008;
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

Deno.test("2009", () => {
  const year = 2009;
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

Deno.test("2010", () => {
  const year = 2010;
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

Deno.test("2011", () => {
  const year = 2011;
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

Deno.test("2012", () => {
  const year = 2012;
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

Deno.test("2013", () => {
  const year = 2013;
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

Deno.test("2014", () => {
  const year = 2014;
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

Deno.test("2015", () => {
  const year = 2015;
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

Deno.test("2016", () => {
  const year = 2016;
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

Deno.test("2017", () => {
  const year = 2017;
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

Deno.test("2018", () => {
  const year = 2018;
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

Deno.test("2019", () => {
  const year = 2019;
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

Deno.test("2020", () => {
  const year = 2020;
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

Deno.test("2021", () => {
  const year = 2021;
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

Deno.test("2022", () => {
  const year = 2022;
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

Deno.test("2023", () => {
  const year = 2023;
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

Deno.test("2024", () => {
  const year = 2024;
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
