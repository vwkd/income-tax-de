// @deno-types="npm:@types/d3@7"
import { range } from "d3";
import { Inflation } from "@vwkd/inflation";
import type { Parameter, Point, Value } from "./types.ts";
import { parameters } from "./data.ts";

export type { Point, Value } from "./types.ts";

/**
 * Einkommensteuerrechner für Deutschland
 */
export class IncomeTax {
  #year: number;
  #parameter: Parameter;
  #inflation: Inflation;

  /**
   * Erstelle Einkommensteuerrechner für Jahr
   *
   * @param year Jahr
   */
  constructor(year: number, inflation: Inflation) {
    const parameter = parameters.find(({ year: y }) =>
      Array.isArray(y) ? y[0] <= year && year <= y[1] : y === year
    );

    if (parameter === undefined) {
      throw new Error(`Parameter for year '${year}' not found`);
    }

    this.#year = year;
    this.#parameter = parameter;
    this.#inflation = inflation;
  }

  /**
   * Liste die Jahre
   *
   * @returns Liste der Jahre
   */
  static get years(): number[] {
    return parameters.flatMap(({ year }) =>
      Array.isArray(year) ? range(year[0], year[1] + 1) : year
    );
  }

  /**
   * Punkte für Grundfreibeträge
   *
   * - bis 2001 in Deutsche Mark (DM)
   * - ab 2002 in Euro (€)
   * @returns Punkte für Grundfreibeträge
   */
  static get basicAllowanceData(): Value[] {
    return parameters.flatMap(({ year, pieces }) => {
      const basicAllowance = pieces.at(0)!.end;

      if (Array.isArray(year)) {
        return Array.from(
          { length: year[1] - year[0] + 1 },
          (_, i) => ({
            Jahr: year[0] + i,
            Wert: basicAllowance,
          }),
        );
      } else {
        return {
          Jahr: year,
          Wert: basicAllowance,
        };
      }
    });
  }

  /**
   * Liste Jahr
   *
   * @returns Jahr
   */
  get year(): number {
    return this.#year;
  }

  /**
   * Liste Eckwerte des zvE
   *
   * - Merke: Eckwerte sind "bis", nicht "ab"
   * @returns Liste der Eckwerte des zvE
   */
  get breakpoints(): number[] {
    return this.#parameter.pieces
      .map(({ end }) => end)
      .filter((end) => end !== Infinity);
  }

  /**
   * Berechne Steuerbetrag
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Steuerbetrag
   */
  amount(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    // note: pieces are sorted by start
    const piece = this.#parameter.pieces
      .find(({ end }) => end === Infinity || zvE <= end);

    if (piece === undefined) {
      throw new Error("unreachable");
    }

    return piece.amount(zvE);
  }

  /**
   * Berechne Durchschnittssteuersatz
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Steuersatz
   */
  rateAverage(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    if (zvE == 0) {
      return 0;
    }

    return this.amount(zvE) / zvE;
  }

  /**
   * Berechne Grenzsteuersatz
   *
   * @param zvE zu versteuerndes Einkommen
   * @returns Grenzsteuersatz
   */
  rateMargin(zvE: number): number {
    if (zvE < 0) {
      throw new Error("Zu versteuerndes Einkommen kann nicht negativ sein");
    }

    // note: pieces are sorted by start
    const piece = this.#parameter.pieces
      .find(({ end }) => end === Infinity || zvE <= end);

    if (piece === undefined) {
      throw new Error("unreachable");
    }

    return piece.rateMargin(zvE);
  }

  /**
   * Berechne Rabatt auf Kosten durch Absetzung
   *
   * @param K Kosten
   * @param B Bemessungsgrundlage
   * @returns Rabatt auf Kosten durch Absetzung
   */
  discount(K: number, B: number): number {
    if (K < 0) {
      throw new Error("Kosten können nicht negativ sein");
    }

    if (B < 0) {
      throw new Error("Bemessungsgrundlage kann nicht negativ sein");
    }

    return this.amount(B) - this.amount(B - K);
  }

  /**
   * Sample nominalen Steuerbetrag
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Steuerbeträge
   */
  amountData(start = 0, end = 350_000, steps = 1000): Point[] {
    const year = this.#year;
    const breakpointStart = this.#parameter.pieces.at(0)!.end;
    const breakpointEnd = this.#parameter.pieces.at(-2)!.end;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > breakpointStart) {
      throw new Error(
        `Start '${start}' must be less or equal to first breakpoint '${breakpointStart}'`,
      );
    }

    if (end < breakpointEnd) {
      throw new Error(
        `End '${end}' must be greater or equal to last breakpoint '${breakpointEnd}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.amount(zvE),
        Wertart: "Nominalwert",
        Jahr: year,
      }));
  }

  /**
   * Sample realen Steuerbetrag
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Steuerbeträge
   */
  amountRealData(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const year = this.#year;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const sb = this.amountData(start, end, steps);

    return sb.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, year, baseyear),
      Wert: this.#inflation.adjust(point.Wert, year, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }

  /**
   * Sample nominalen Durchschnittssteuersatz
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Durchschnittssteuersätze
   */
  rateAverageData(start = 0, end = 350_000, steps = 1000): Point[] {
    const year = this.#year;
    const breakpointStart = this.#parameter.pieces.at(0)!.end;
    const breakpointEnd = this.#parameter.pieces.at(-2)!.end;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > breakpointStart) {
      throw new Error(
        `Start '${start}' must be less or equal to first breakpoint '${breakpointStart}'`,
      );
    }

    if (end < breakpointEnd) {
      throw new Error(
        `End '${end}' must be greater or equal to last breakpoint '${breakpointEnd}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.rateAverage(zvE),
        Wertart: "Nominalwert",
        Jahr: year,
      }));
  }

  /**
   * Sample realen Durchschnittssteuersatz
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Durchschnittssteuersätze
   */
  rateAverageRealData(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const year = this.#year;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const sd = this.rateAverageData(start, end, steps);

    return sd.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, year, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }

  /**
   * Sample nominalen Grenzsteuersatz
   *
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der zvE und nominalen Grenzsteuersätze
   */
  rateMarginData(start = 0, end = 350_000, steps = 1000): Point[] {
    const year = this.#year;
    const breakpointStart = this.#parameter.pieces.at(0)!.end;
    const breakpointEnd = this.#parameter.pieces.at(-2)!.end;

    if (start < 0) {
      throw new Error(`Start '${start}' must be greater or equal to 0`);
    }

    if (start > breakpointStart) {
      throw new Error(
        `Start '${start}' must be less or equal to first breakpoint '${breakpointStart}'`,
      );
    }

    if (end < breakpointEnd) {
      throw new Error(
        `End '${end}' must be greater or equal to last breakpoint '${breakpointEnd}'`,
      );
    }

    const step = (end - start) / steps;

    return range(start, end, step)
      .map((zvE) => ({
        zvE: zvE,
        Wert: this.rateMargin(zvE),
        Wertart: "Nominalwert",
        Jahr: year,
      }));
  }

  /**
   * Sample realen Grenzsteuersatz
   *
   * @param baseyear Basisjahr für Realwert, größer gleich Jahr
   * @param start Minimum zvE, größer gleich 0, kleiner gleich erstem Eckwert des zvE
   * @param end Maximum zvE, größer gleich letztem Eckwert des zvE
   * @param steps Anzahl der Samples
   * @returns Liste der realen zvE und realen Grenzsteuersätze
   */
  rateMarginRealData(
    baseyear: number,
    start = 0,
    end = 350_000,
    steps = 1000,
  ): Point[] {
    const year = this.#year;

    if (year > baseyear) {
      throw new Error(
        `Base year '${baseyear}' must be greater or equal to year '${year}'`,
      );
    }

    const sd = this.rateMarginData(start, end, steps);

    return sd.map((point) => ({
      ...point,
      zvE: this.#inflation.adjust(point.zvE, year, baseyear),
      Wertart: `Realwert (${baseyear})`,
    }))
      // note: cut off after last nominal zvE since larger real zvEs extend plot to the right
      .filter(({ zvE }) => zvE <= end);
  }
}
